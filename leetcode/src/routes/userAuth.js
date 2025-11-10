const express = require('express')
const authRouter = express.Router()
const {register,login,adminRegister,getProfile,logout,deleteProfile} = require('../controllers/userAuthenticate')
const userMiddleware= require('../middleware/userMiddleware')
const adminMiddleware = require("../middleware/adminMiddleware")
//Register, Login, Logout, GetProfile
authRouter.post('/register',register)
authRouter.post('/login',login)
authRouter.post('/logout',userMiddleware,logout)
authRouter.post('/getProfile',adminMiddleware,getProfile)
authRouter.post('/deleteProfile',adminMiddleware,deleteProfile)
authRouter.get('/check',userMiddleware,(req,res)=>{
    const reply={
        firstName:req.result.firstName,
        emailId:req.result.emailId,
        _id:req.result._id,
        role:req.result.role
    }
    res.status(200).json({
        user:reply,
        message:"Valid User"
    })
})


authRouter.post('/admin/register',adminRegister)
module.exports = authRouter