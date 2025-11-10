const express = require('express')
const submitRouter = express.Router()

const SubmitRateLimiter  = require("../controllers/rateLimit")
const userMiddleware = require("../middleware/userMiddleware")
const {submitCode,runCode} = require("../controllers/userSubmission")

submitRouter.post('/submit/:id' ,userMiddleware,SubmitRateLimiter , submitCode)
submitRouter.post('/run/:id' ,userMiddleware , runCode)

module.exports = submitRouter