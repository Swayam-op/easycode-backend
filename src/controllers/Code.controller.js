import axios from 'axios';
import { compileAndRun, convertOutputStringToArray } from '../utils/Code.utils.js';
import { STATUS } from '../utils/StatusCode.js';
import Code from '../models/Code.model.js';
import Question from '../models/Question.model.js';
import User from '../models/User.model.js';
import chalk from 'chalk';
import mongoose from 'mongoose';
export async function runCode(req, res) {
  const { question_id, language_id, source_code } = req.body;  // {language_id, source_code, stdin}
  
  //Use zod for req.body validation
  try {
      console.log("Body of runCode : ",req.body);
      const question = await Question.findOne({_id : question_id});
      const originalSourceCode = question.hiddenCode[0] + " " + source_code + " "+ question.hiddenCode[1];
      const inputs = question.testCases;
      const expected_output = question.expectedOutputOfTestCases;
      console.log("Original code : ",originalSourceCode);
      const compiled_response = await compileAndRun(language_id, originalSourceCode, inputs, expected_output);
      console.log(compiled_response);
      console.log("status : ", atob(compiled_response.expected_output));
      const response_message = compiled_response.status.description;
      // console.log("output of code is : ", convertOutputStringToArray(atob(compiled_response.stdout)));
      const response_data = {
        error_message: compiled_response.stderr ? atob(compiled_response.stderr) : "",
        runTime_message : compiled_response.message ? atob(compiled_response.message) : "",
        time_taken: compiled_response.time,
        memory : compiled_response.memory,
        compile_output : compiled_response.compile_output ? atob(compiled_response.compile_output):"",
        output: compiled_response.stdout ? atob(compiled_response.stdout) : "",
        outputToDisplay : compiled_response.stdout ?convertOutputStringToArray(atob(compiled_response.stdout)) : [],
        expectedOutputToDisplay : question.expectedOutputOfTestCasesToDisplay,
        testCasesToDisplay: question.testCasesToDisplay
      }
      return res.status(STATUS.ACCEPTED).json({ message: response_message, data: response_data });

  }
  catch (error) {
    console.log("Error in runCode controller : ", error);
    return res.status(STATUS.BADREQUEST).json({ message: error.message });
  }

}

export async function submitCode(req, res) {
  //Get all the information
  const pt = Date.now();
  console.log(chalk.red("start time", pt));
  console.log(req.user);
  try {
    const { question_id, language_id, source_code } = req.body;
    if (!question_id || !language_id ||  !source_code) {
      throw Error("Some fileds are empty");
    }
    var user = await User.findOne({_id : req.user._id, isDelete : false});
    
    //Get question details
    const question = await Question.findOne({_id : question_id, isDelete : false});
    console.log(question)
    const hiddenTestCases = question.hiddenTestCases;
    const originalSourceCode = question.hiddenCode[0] + " " + source_code + " "+ question.hiddenCode[1];
    const expected_output = question.expectedOutputOfHiddenTestCases;
    console.log(chalk.red("before compilation time", Date.now() - pt));
    // Run code
    const compiled_response = await compileAndRun(language_id, originalSourceCode, hiddenTestCases, expected_output);
    console.log(chalk.green("Code compiled successfully"));
    // console.log(compiled_response);

    //Updating response_data
    let response_message = compiled_response.status.description;
      
    let response_data = {
      error_message: compiled_response.stderr ? atob(compiled_response.stderr) : "",
      runTime_message : compiled_response.message ? atob(compiled_response.message) : "",
      time_taken: compiled_response.time,
      memory : compiled_response.memory/1024,
      compile_output : compiled_response.compile_output ? atob(compiled_response.compile_output):"",
      output: compiled_response.stdout ? atob(compiled_response.stdout) : "",
      outputToDisplay : compiled_response.stdout ?convertOutputStringToArray(atob(compiled_response.stdout)) : [],
      expectedOutputToDisplay : question.expectedOutputOfHiddenTestCasesToDisplay,
      hiddenTestCasesToDisplay:question.hiddenTestCasesToDisplay,
      expectedOutputOfHiddenTestCases : question. expectedOutputOfHiddenTestCases,
      submitedAtTime : new Date().toLocaleString(),
      source_code : source_code,
      statusId : compiled_response.status.id
    } 
    response_message = compiled_response.status.description;
    
   res.status(STATUS.ACCEPTED).json({
    message : response_message,
    data : response_data
  });
 console.log(chalk.red("Time after res ssent ", Date.now() - pt));
        //Create one Code Object
        const submitted_code = new Code({
          question : question._id,
          user : user._id,
          sourceCode : source_code,
          language : language_id,
          timeTaken : compiled_response.time,
          memory : compiled_response.memory,
          status : compiled_response.status.description,
          status_id : compiled_response.status.id,
          
        });
        await submitted_code.save();
        console.log(chalk.green("submission code is created"));
        
        //update user details
        user.submissions.push({question_id : question._id, submission_id : submitted_code._id});
        user.recentactivity.push({name : "Code submission", message : compiled_response.status.description, description : question.questionName, date : new Date().toLocaleString() });
        const isSolvedAlready = user.solvedQuestions.filter((item)=>item === question._id);
        if(!isSolvedAlready){
          user.solvedQuestions.push(question._id);
        }
      // console.log(user.solvedproblems);
      await user.save();
      console.log(chalk.green("User details is updated", user));
      
      console.log(chalk.red("after user update time", Date.now() - pt));

      return;
  }
  catch (error) {
    console.log(chalk.red("Error in submission controller : ", error));
    return res.status(STATUS.SERVERERROR).json({message : error.message});
  }
}


export async function runCodeForTesting(req, res) {
  const { question_id, language_id, source_code, stdin, expected_output } = req.body;  // {language_id, source_code, stdin}
  
  try {
      console.log(expected_output);
      const compiled_response = await compileAndRun(language_id, source_code, stdin, expected_output);
      console.log(compiled_response);
      console.log("status : ", atob(compiled_response.expected_output));
      const response_message = compiled_response.status.description;
      console.log("output of code is : ", convertOutputStringToArray(atob(compiled_response.stdout)));
      const response_data = {
        error_message: compiled_response.stderr ? atob(compiled_response.stderr) : "",
        runTime_message : compiled_response.message ? atob(compiled_response.message) : "",
        time_taken: compiled_response.time,
        memory : compiled_response.memory/1024,
        compile_output : compiled_response.compile_output ? atob(compiled_response.compile_output):"",
        output: compiled_response.stdout ? atob(compiled_response.stdout) : "",
        outputToDisplay : compiled_response.stdout ?convertOutputStringToArray(atob(compiled_response.stdout)) : [],
        submitedAtTime : new Date().toLocaleString(),
        source_code : source_code,
        statusId : compiled_response.status.id
      }
      return res.status(STATUS.ACCEPTED).json({ message: response_message, data: response_data });

  }
  catch (error) {
    console.log("Error in runCode controller : ", error);
    return res.status(STATUS.BADREQUEST).json({ message: error.message });
  }

}
