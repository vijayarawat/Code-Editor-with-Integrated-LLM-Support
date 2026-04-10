// const axios = require('axios')

// const getLanguageById =(lang)=>{
//     console.log(lang)
//     const language =  {
//         "c++":54,
//         "java":62,
//         "javascript":63
//     }
//     // if (lang == null) return null;            // handles null/undefined
//     // const langStr = String(lang).toLowerCase();
//     // console.log("langStr", langStr ) // convert to string then lowercase
//     // return language[langStr] ?? null;    
//     //     // console.log(language)
//     return language[lang.toLowerCase()];
// }


// const submitBatch = async (submissions)=>{

//         // console.log("submissions", submissions) 
//     const options = {
//     method: 'POST',
//     url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//     params: {
//         base64_encoded: 'false'
//     },
//     headers: {
//         'x-rapidapi-key': 'ceeec03151msh59632e9a3f11202p1aa914jsn361be27017c2',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//         'Content-Type': 'application/json'
//     },
    
//     data: {
//         submissions
//     }
//     };

//     async function fetchData() {
//         try {
//             const response = await axios.request(options);
//             // console.log(response.data);
//             return response.data
//         } catch (error) {
//             console.error(error);
//         }
//     }
// //returns the token for each submission in an array format 
//      return await fetchData();
// }

// const waiting = async(timer)=>{
//   setTimeout(()=>{
//     return 1;
//   },timer);
// }
// const SubmitToken = async(resultToken)=>{
    

//     const options = {
//     method: 'GET',
//     url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
//     params: {
//         tokens: resultToken.join(','),
//         base64_encoded: 'false',
//         fields: '*'
//     },
//     headers: {
//         'x-rapidapi-key': 'ceeec03151msh59632e9a3f11202p1aa914jsn361be27017c2',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//     }
//     };

//     async function fetchData() {
//         try {
//             const response = await axios.request(options);
//             // console.log(response.data);

//             return response.data;
//             // response.data ->object hai submisiions ka jo ki khud 1 array hai for the tokens
//             //  sumbitted .y  sara data return krega for each token
//             // {
//             //     submissions:[
//             //         {
//             //             "language_id",stdout,status_id, stderr, token
//             //         }
//             //     ]
//             // }
//         }
//          catch (error) {
//             console.error(error);
        
//         }
//     }
// while(true){
// const result =  await fetchData();



// const testResult = result.submissions
// const isResultObtained = testResult.every((r)=>r.status_id>2)
// if(isResultObtained)
//     return result.submissions
// await waiting(1000)

// }
// }


// module.exports = {getLanguageById,submitBatch,SubmitToken}


const axios = require('axios');


const getLanguageById = (lang)=>{

    const language = {
        "c++":54,
        "java":62,
        "javascript":63
    }


    return language[lang.toLowerCase()];
}


const submitBatch = async (submissions)=>{

const options = {
  method: 'POST',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    base64_encoded: 'false'
  },
  headers: {
    'x-rapidapi-key': 'cbbaa872eemsh9717c13847a19e6p140f09jsnbad262a17220',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
    'Content-Type': 'application/json'
  },
  // headers: {
  //   'x-rapidapi-key': 'a74b3bc2abmsh6e450a086b2c5ebp1ef6cajsn98852fd1bf88',
  //   'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
  //   'Content-Type': 'application/json'
  // },
  // headers: {
//         'x-rapidapi-key': 'ceeec03151msh59632e9a3f11202p1aa914jsn361be27017c2',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//         'Content-Type': 'application/json'
//     },
  data: {
    submissions
  }
};

async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

 return await fetchData();

}


const waiting = async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

// ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]

const submitToken = async(resultToken)=>{
const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: resultToken.join(','),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'cbbaa872eemsh9717c13847a19e6p140f09jsnbad262a17220',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  },
  // headers: {
  //   'x-rapidapi-key': 'a74b3bc2abmsh6e450a086b2c5ebp1ef6cajsn98852fd1bf88',
  //   'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  // }
  //headers: {
//         'x-rapidapi-key': 'ceeec03151msh59632e9a3f11202p1aa914jsn361be27017c2',
//         'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//         'Content-Type': 'application/json'
//     },
};

async function fetchData() {
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


 while(true){

  const result =  await fetchData();
  console.log(result)
  console.log("IsResultObtained ")
  const IsResultObtained =  result.submissions.every((r)=>r.status_id>2);
  console.log("IsResultObtained " +IsResultObtained)
  if(IsResultObtained)
    return result.submissions;

  
  await waiting(1000);
}



}


module.exports = {getLanguageById,submitBatch,submitToken};








// 


