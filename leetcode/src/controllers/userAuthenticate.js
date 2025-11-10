const redisClient = require('../models/redis')
const User = require('../models/user')
const Submission = require("../models/submission")
const validate = require("../utils/validator")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { findByIdAndDelete } = require('../models/problem')

const register = async(req,res)=>{
    try{

        validate(req.body)
        const {firstName, emailId,password} = req.body;
        
        req.body.password = await bcrypt.hash('password',10)

        
        req.body.role="user" //always a user role will be created.
        const user = await User.create(req.body)
        const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'}, process.env.JWT_KEY,{expiresIn:3600})
        
        const reply = {firstName: user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:req.result.role

        }
        
        res.cookie('token',token,{maxAge:10*60*1000})
        // res.status(201).send("user created Successfully")
        res.status(200).json({
            user:reply,
            message:"Registered successfully"
        })
    }
    catch(err){
        console.log("error: "+err)
        res.status(400).send("Error:" +err)
    }
}

const login = async(req,res)=>{
    try{
        const {emailId,password} = req.body;
        if(!emailId)
            throw new Error("Invalid Credentials")
        if(!password)
            throw new Error("Invalid Credentials")
        const user = await User.findOne({emailId})
        if(!user)
            console.log("user not found")
        const match = bcrypt.compare(password,user.password)
        console.log("creds matched")
        if(!match)
            throw new Error("Invalid Credentials")
        const token = jwt.sign({_id:user._id,emailId:emailId, role:user.role}, process.env.JWT_KEY,{expiresIn:'1h'})
        console.log(token)
        res.cookie('token',token,{maxAge:60*60*1000})

        const reply = {firstName: user.firstName,
            emailId:user.emailId,
            _id:user._id,
            role:user.role

        }
        
        console.log("cookie generated")
        // res.status(200).send("Login successfull")
        res.status(200).json({
            user:reply,
            message:"Logged in  successfully"
        })

    }
    catch(err){
        res.status(401).send("unauthorized Access")
    }
}

const logout = async(req,res)=>{

    try{

        const {token} = req.cookies;
        //console.log(token)

        const payload = jwt.decode(token)
        // console.log(payload)
        await redisClient.set(`token:${token}`,"Blocked")
        await redisClient.expireAt(`token:${token}`,payload.exp);

        //add token to blocklist of redis

        //Cookies ko clear kar dena hai 
        res.cookie("token",null, {expires:new Date(Date.now())});
        return res.status(200).json({ message: "Logged out successfully" });

    }
    catch(err){
        res.status(503).send("Error"+err)
    }
    
}
const adminRegister = async(req,res)=>{

    try{
        // validate the data;
        //if(req.result.role!='admin')
        //throw new Error("Invalid Credentials");  
        
        validate(req.body)
        const {firstName, emailId,password} = req.body;
        
        req.body.password = await bcrypt.hash('password',10)

        // req.body.role="admin" //always a user role will be created.
        const user = await User.create(req.body)
        const token = jwt.sign({_id:user._id,emailId:emailId,role:user.role}, process.env.JWT_KEY,{expiresIn:3600})
        res.cookie('token',token,{maxAge:10*60*1000})
        res.status(201).send("user created Successfully")

    }
    catch(err){
        console.log("error: "+err)
        res.status(400).send("Error:" +err)
    }

}
const getProfile = async(req,res)=>{

}
const deleteProfile=async(req,res)=>{
    try{
        const userId = req.result._id
        await findByIdAndDelete(userId)
        //delete the submissions made by user from the submission model
        Submission.deleteMany({userId})
        res.send("Deleted Successfully")

    }
    catch(err){
         res.status(400).send("Error:" +err)
    }
}

module.exports = {login, logout,register,getProfile,adminRegister,deleteProfile}