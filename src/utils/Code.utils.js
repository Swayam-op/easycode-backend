import axios from "axios";

const checkCodeStatus = async (token) => {
  const options = {
    method: "GET",
    url: process.env.RAPID_API_URL + "/" + token,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    },
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const compileCode = async (language_id, source_code, stdin, expected_output) => {
  const encoded_data = {
    language_id,
    source_code: btoa(source_code),
    stdin: btoa(stdin),
    expected_output : btoa(expected_output)
  };
  const options = {
    method: "POST",
    url: process.env.RAPID_API_URL,
    params: { base64_encoded: "true", fields: "*" },
    headers: {
      "content-type": "application/json",
      "Content-Type": "application/json",
      "X-RapidAPI-Host": process.env.RAPID_API_HOST,
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    },
    data: encoded_data,
  };

  try{
    const response = await axios.request(options);
    console.log("Compiled code's token is ", response.data.token);
    return response;
  }
  catch(error){
    throw error;
  }
}

const compileAndRun = async(language_id, source_code, stdin, expected_output) =>{
  try{
    const response = await compileCode(language_id, source_code, stdin, expected_output);
    
    //Sometimes after compilation of code, the compiled_token does not fetch data, so here we call checkCode until we get result
       let check_response = null;
       while( check_response == null || check_response.status.id == 2){
        await takeTime(500);
        check_response = await checkCodeStatus(response.data.token);
       }
       
      console.log(check_response);
      return check_response;
    
  }
  catch(error){
    throw error;
  }
}

function takeTime(time){
  return new Promise((resolve)=>{
    setTimeout(()=>{
      resolve();
    },time);
  })
}

export function convertOutputStringToArray(output){
  let output_array = output.split('\n');
  if(output_array[output_array.length - 1] === '')output_array.pop();
  return output_array;
}
export { checkCodeStatus, compileCode, compileAndRun };