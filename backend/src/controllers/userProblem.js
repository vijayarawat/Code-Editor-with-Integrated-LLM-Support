const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility")
const Problem = require("../models/problem");
const User = require("../models/user");
const Submissions = require("../models/submission")
const SolutionVideo = require("../models/solutionVideo")

const createProblem = async (req,res)=>{

    const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;
    console.log("Vijaya")

    try{
       
      for(const {language,completeCode} of referenceSolution){
         

        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);
        // console.log("submitResult is:", submitResult);
        // console.log("type:", typeof submitResult);

        const resultToken = submitResult.map((value)=> value.token);
        console.log("resultToken is:", resultToken);
        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
        
       const testResult = await submitToken(resultToken);

       console.log("testResult",testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }


      // We can store it in our DB

    const userProblem =  await Problem.create({
        ...req.body,
        problemCreator: req.result._id
      });

      res.status(201).send("Problem Saved Successfully");
    }
    catch(err){
        res.status(400).send("Error: "+err);
    }
}

const updateProblem = async(req,res)=>{

  const {id} = req.params
  if(!id)
   return  res.status(400).send("Misiing ID field")
  console.log("ID= ", id)
  const DsaProblem = await Problem.findById(id)
  if(!DsaProblem)
    return res.status(404).send("ID is not present in server")

   const {title,description,difficulty,tags,
        visibleTestCases,hiddenTestCases,startCode,
        referenceSolution, problemCreator
    } = req.body;

  try{
      
      for(const {language,completeCode} of referenceSolution){      
        // source_code:
        // language_id:
        // stdin: 
        // expectedOutput:

        const languageId = getLanguageById(language);
        console.log(languageId)
        // I am creating Batch submission
        const submissions = visibleTestCases.map((testcase)=>({
            source_code:completeCode,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));


        const submitResult = await submitBatch(submissions);
        // console.log(submitResult);
        console.log("submitResult is:", submitResult);
        console.log("type:", typeof submitResult);

        const resultToken = submitResult.map((value)=> value.token);
        console.log("resultToken is:", resultToken);
        // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]
        
        
       const testResult = await submitToken(resultToken);

       console.log("testResult",testResult);

       for(const test of testResult){
        if(test.status_id!=3){
         return res.status(400).send("Error Occured");
        }
       }

      }

      const newProblem = await Problem.findByIdAndUpdate(id, {...req.body},{runValidators:true,new:true})
      res.status(200).send("Problem updated successfully")
  }
  catch(err){
    res.status(400).send(err)
  }
}


const deleteProblem= async(req,res)=>{
  const {id} = req.params
  if(!id)
    return  res.status(400).send("Misiing ID field")


  try{

    const isDeleted = await Problem.findByIdAndDelete(id)

      if(!isDeleted)
    return  res.status(400).send("Problem not present ")

    return res.status(200).send("Problem deleted successfully")

  }
  catch(err){
      res.status(500).send(err)
  }

}
const getProblemById = async (req,res)=>{
  const {id} = req.params;
  if(!id)
      return res.status(404).send("Id is missing")
  try{
    const isPresent = await Problem.findById(id).select('_id title description difficulty tags visibleTestCases startCode referenceSolution')
    if(!isPresent)
      res.status(404).send("Problem is not present")

    const vedios = await SolutionVideo.findOne({problemId:id})
    if(vedios){

     const responseData={
      ...isPresent.toObject(),
      cloudinaryPublicId : vedios.cloudinaryPublicId,
     secureUrl:vedios.secureUrl,
     thumbnailUrl:vedios.thumbnailUrl,
     duration:vedios.duration

     } 
  
    return res.status(200).send(responseData)
    }
    return res.status(200).send(isPresent)
  }
  catch(err){
    res.status(500).send(err)
  }

}
const getAllProblem = async (req,res)=>{
  
  try{
    const isPresent = await Problem.find({}).select('_id title difficulty tags ')
    if(isPresent.length == 0 )
      res.status(404).send("Problem is not present")
    res.status(200).send(isPresent)
  }
  catch(err){
    res.status(500).send(err)
  }

}
const solvedAllProblemByUser = async(req,res)=>{
  
  try{
    // const count = req.result.problemSolved.length;
    // res.send(count)

    const userId = req.result._id;
    const user = await User.findById(userId).populate({
      path:"problemSolved",
      select:"_id title difficulty tags"
    })
    res.send(user.problemSolved)
  }
  catch(err){
res.status(500).send(err)
  }
  
}
const submittedProblem= async(req,res)=>{
  try{
    const userId = req.result._id
    const problemId = req.params.pid
    const result  = await Submissions.find({userId,problemId})

    if(result.length == 0)
      return  res.send("No submissions for this problem")
    
    res.status(200).send(result)
  }
  catch(err){
    // console.log(err)
    res.status(500).send(err)
  }
}

module.exports = {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem};


// const submissions = [
//     {
//       "language_id": 46,
//       "source_code": "echo hello from Bash",
//       stdin:23,
//       expected_output:43,
//     },
//     {
//       "language_id": 123456789,
//       "source_code":
//  "print(\"hello from Python\")"
//     },
//     {
//       "language_id": 72,
//       "source_code": ""
//     }
//   ]
// const createProblem = async(req,res)=>{
//     const {title,description,difficulty,tags,visibleTestCases,hiddenTestCases,startCode,referenceSolution,problemCreator} = req.body;
        

//     try{
//         //referenceSolution is an Array in the model problem
//         //Dummy examples-  
//         // referenceSolution=[
//         //     {language:"c++" , completeCode:"cpp ka code"},
//         //     {language:"Java" , completeCode:"Java ka code"},
//         //     {language:"JS" , completeCode:"JS ka code"}       
//         // ]

//         //required input in the JUDGE0==============================
//         //language_id, source_code, sdin, expectedOutput============

//         for(const{language,completeCode} of referenceSolution){
//             console.log("language= ",language)
//             const languageID = getLanguageById(language)

//             //creating the batch submission
//             //All cpp code ka batch create kiya then send for submission
//             //All Java code ka batch create kiya then send for submission
            
//             const submissions = visibleTestCases.map((testcase)=>({
//                 source_code :completeCode,
//                 language_id:languageID,
//                 stdin:testcase.input,
//                 expected_output:testcase.output
//             }))

//             const submitResult = await submitBatch(submissions)
//             console.log("submitResult", submitResult)
//             //submitResult mein we will get the token wrt to each bach sent in the submission 
//             //ex- 3 codes send then we recieve 3 token. One for each batch we sent 
//             const resultToken = submitResult.map((value)=>value.token) 
//             //resultToken -> array of token given by Judge0
//             // ["db54881d-bcf5-4c7b-a2e3-d33fe7e25de7","ecc52a9b-ea80-4a00-ad50-4ab6cc3bb2a1","1b35ec3b-5776-48ef-b646-d5522bdeb2cc"]   
            
//             console.log("resultToken" ,resultToken)
//             const testResult = await SubmitToken(resultToken)
//             //test result will contain this 
//             // testResult = submissions:[
//             //         {
//             //             "language_id",stdout,status_id, stderr, token
//             //         }

//             for(const test of testResult){
//                 if(test.status_id!=3){
//                    return res.status(400).send("error occured")
//                 }
//             }
//         }
//         console.log(req.result._id  )
//         //Now we can store it in DB
//         const userProblem =  await Problem.create({
//             ...req.body,
//             problemCreator:req.result._id   //came from admin middleware jab authenticate kiya tha 
//         })
//         res.status(201).send("problem saved successfully")
//     }
//     catch(err){
//         res.send("error: "+err)
//     }
// }

// module.exports = createProblem