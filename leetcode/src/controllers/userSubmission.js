const Problem = require("../models/problem")
const Submission = require("../models/submission")
const problemRouter = require("../routes/problemCreator")
const {getLanguageById,submitBatch,submitToken} = require("../utils/problemUtility")

const submitCode = async(req,res)=>{

    try{
        const userId= req.result._id
        const problemId = req.params.id;
        
        const{code,language} = req.body

        if(!userId || !problemId || !code || !language)
            res.status(400).send("Some fields are missing")

        if(language==='cpp')
            language='c++'
        
         console.log(language);
        //Fetch the probelm from the Problem DB
        const problem = await Problem.findById(problemId)
        //(hidden) testcases

        //Phle submission ko DB mein store kara do as a pendidng state
        const submittedResult = await Submission.create({
            userId,
            problemId,
            code,
            language,
            status:'pending',
            testCasesTotal:problem.hiddenTestCases.length
        })

        // submit code to judge 0 
         const languageId = getLanguageById(language);
          
        // I am creating Batch submission
        const submissions = problem.hiddenTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        console.log("Submission made is" ,submissions)
        const submitResult = await submitBatch(submissions);
        // console.log(submittedResult);
        // console.log("submittedResult is:", submittedResult);
        // console.log("type:", typeof submittedResult);

        const resultToken = submitResult.map((value)=> value.token);
        console.log("resultToken is:", resultToken);
        const testResult = await submitToken(resultToken);

        let testCasesPassed =0;
        let runtime=0;
        let memory=0;
        let status="accepted"
        let errorMessage=null
        //update the submitted result 
        for( const test of testResult){
            if(test.status_id==3)
            {
                testCasesPassed++;
                runtime = runtime+parseFloat(test.time)
                memory = Math.max(memory,test.memory)
            }
            else{
                if(test.status_id==4){
                    status="error"
                    errorMessage = test.stderr
                }
                else{                
                    status="wrong"
                    errorMessage = test.stderr
                }


            }
        }

        submittedResult.status= status
        submittedResult.testCasesPassed= testCasesPassed
        submittedResult.errorMessage= errorMessage
        submittedResult.memory=memory
        submittedResult.runtime = runtime
        
        await submittedResult.save();

        // console.log("submittedResult updated",submittedResult)

        //insert ProblemId into the userSchema for the problemSolved field if the field is not already present there 
        if(!req.result.problemSolved.includes(problemId))
        {
            req.result.problemSolved.push(problemId)
            await req.result.save()
        }
        const accepted = (status == 'accepted')
        res.status(201).json({
        accepted,
        totalTestCases: submittedResult.testCasesTotal,
        passedTestCases: testCasesPassed,
        runtime,
        memory
        });
       
    }
    catch(err){
        res.status(500).send("internal server error")
    }
}


const runCode = async(req,res)=>{

    try{
        const userId= req.result._id
        const problemId = req.params.id;
        
        const{code,language} = req.body

        if(!userId || !problemId || !code || !language)
            res.status(400).send("Some fields are missing")

        if(language==='cpp')
            language='c++'

        //Fetch the probelm from the Problem DB
        const problem = await Problem.findById(problemId)
        //(hidden) testcases

        // submit code to judge 0 
         const languageId = getLanguageById(language);
          console.log("Run code")
        // I am creating Batch submission
        const submissions = problem.visibleTestCases.map((testcase)=>({
            source_code:code,
            language_id: languageId,
            stdin: testcase.input,
            expected_output: testcase.output
        }));
        console.log("Run successfully")
        console.log("Submission made is" ,submissions)
        const submitResult = await submitBatch(submissions);
        // console.log(submittedResult);
        // console.log("submittedResult is:", submittedResult);
        // console.log("type:", typeof submittedResult);

        const resultToken = submitResult.map((value)=> value.token);
        console.log("resultToken is:", resultToken);
        const testResult = await submitToken(resultToken);

        let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = true;
    let errorMessage = null;

    for(const test of testResult){
        if(test.status_id==3){
           testCasesPassed++;
           runtime = runtime+parseFloat(test.time)
           memory = Math.max(memory,test.memory);
        }else{
          if(test.status_id==4){
            status = false
            errorMessage = test.stderr
          }
          else{
            status = false
            errorMessage = test.stderr
          }
        }
    }

   
  
   res.status(201).json({
    success:status,
    testCases: testResult,
    runtime,
    memory
   });


    }
    catch(err){
        res.status(500).send("internal server error")
    }
}

module.exports ={ submitCode,runCode}


// test result output 
//     language_id: 63,
//     stdin: '-1 10',
//     expected_output: '9',
//     stdout: '9\n',
//     status_id: 3,
//     created_at: '2025-09-20T04:22:23.652Z',
//     finished_at: '2025-09-20T04:22:24.000Z',
//     time: '0.023',
//     memory: 7680,
//     stderr: null,
//     token: 'c0b2cd9f-06c1-4b11-bce1-d158eba75fd5',
//     number_of_runs: 1,