import axios from 'axios';
import { compileAndRun } from '../utils/Code.utils.js';
import { STATUS } from '../utils/StatusCode.js';
import Code from '../models/Code.model.js';
import Question from '../models/Question.model.js';
import User from '../models/User.model.js';
import chalk from 'chalk';
import mongoose from 'mongoose';

export async function runCode(req, res) {
  const { language_id, source_code, stdin } = req.body;  // {language_id, source_code, stdin}
  
  try {

      const compiled_response = await compileAndRun(language_id, source_code, stdin);
      console.log(compiled_response);
      const response_message = compiled_response.message ? atob(compiled_response.message) : "Code runs successfully";
      const response_data = {
        output: compiled_response.stdout ? atob(compiled_response.stdout) : "",
        error_message: compiled_response.stderr ? atob(compiled_response.stderr) : "",
        time_taken: compiled_response.time,
        memory : compiled_response.memory
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

    // Run code
    const compiled_response = await compileAndRun(language_id, source_code, hiddenTestCases[0].input);
    console.log(chalk.green("Code compiled successfully"));
    // console.log(compiled_response);

    let response_message;
    let response_data = {};
    if(compiled_response.message){
      response_message =  atob(compiled_response.message);
      response.data["error_message"] = atob(compiled_response.stderr);
    }
    else{
      const compiled_output = atob(compiled_response.stdout);

      //if compiled_output answer matches to hidden testcase's expected answer
      if(hiddenTestCases[0].output.indexOf(compiled_output)){
        //Create one Code Object
        const submitted_code = new Code({
          question : question._id,
          user : user._id,
          sourceCode : source_code,
          language : language_id,
          timeTaken : compiled_response.time,
          memory : compiled_response.memory
        });
        await submitted_code.save();
        console.log(chalk.green("submission code is created"));
        
        //update user details
        user.solvedproblems = {...user.solvedproblems, ["sp"] : user.solvedproblems.sp? user.solvedproblems.sp+1 : 1};
        user.solutiontoproblems.push({question : question._id, solution : submitted_code._id});
        user.recentactivity.push({name : "Code submission", message : "Accepted", question_id : question._id, date : new Date().toLocaleString() });
        
        //update reeponse
        response_message = "Submission Accepted";
        response_data["success"] = true;
      }
      else{
      user.recentactivity.push({name : "Code submission", message : "Wrong submission", question_id : question._id, date : new Date().toLocaleString() });
      response_message = "Wrong Submission";
      response_data["success"] = false;
      }
      // console.log(user.solvedproblems);
      user.solvedproblems = {...user.solvedproblems, ["submissions"] : user.solvedproblems.submissions? user.solvedproblems.submissions+1 : 1}
      await user.save();
      console.log(chalk.green("User details is updated", user));

      //Updating response_data
      response_data["testCase"] = question.hiddenTestCases[0].input;
      response_data["output"] = compiled_output;
      response_data["expected_output"] = hiddenTestCases[0].output;
      response_data["time"] = compiled_response.time;
      response_data["memory"] = compiled_response.memory;
      

      return res.status(STATUS.ACCEPTED).json({
        message : response_message,
        data : response_data
      });
    }
  }
  catch (error) {
    console.log(chalk.red("Error in submission controller : ", error));
    return res.status(STATUS.SERVERERROR).json({message : error.message});
  }
}