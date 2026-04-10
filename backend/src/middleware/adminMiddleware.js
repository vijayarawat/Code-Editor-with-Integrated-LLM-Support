const jwt = require('jsonwebtoken')
const user = require("../models/user")
const redisClient  = require("../models/redis")

const adminMiddleware = async(req,res,next)=>{
    try{
        const {token} = req.cookies;
        
        if(!token)
            throw new Error("Token is not present")
        
        const payload = await jwt.verify(token, process.env.JWT_KEY)

        const {_id} = payload;
        if(!_id)
            throw new Error("Id is missing")

        const result = await user.findById(_id);
        
        if(payload.role!="admin")
            throw new Error("Invlaid token")

        if(!result)
            throw new Error("User does not exists")

        //redis ki block list mein present toh nahi hai 
        const isBlocked = await redisClient.get(`token:${token}`);

        if (isBlocked) {
        throw new Error("Token has been revoked");}
            // console.log(req.result)
        req.result = result;
        next();
    }
    catch(err){
        res.status(401).send("Error: "+err)
    }
}

module.exports = adminMiddleware;