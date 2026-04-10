const express = require('express')
const problemRouter = express.Router()
const adminMiddleware = require("../middleware/adminMiddleware")
const userMiddleware = require("../middleware/userMiddleware")
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,solvedAllProblemByUser,submittedProblem}= require("../controllers/userProblem")


// For Admin
problemRouter.post("/create",adminMiddleware,createProblem)
problemRouter.put("/update/:id",adminMiddleware,updateProblem)
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem)


//For user
problemRouter.get("/ProblemById/:id",userMiddleware,getProblemById)  
problemRouter.get("/getAllProblem",userMiddleware,getAllProblem)
problemRouter.get("/problemSolvedByUser",userMiddleware,solvedAllProblemByUser)

problemRouter.get("/submittedProblem/:pid",userMiddleware,submittedProblem)


module.exports = problemRouter