to generate a random JWT KEY - 
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"


generate token---
const token = jwt.sign({_id:user._id,emailId:emailId,role:'user'}, process.env.JWT_KEY,{expiresIn:3600})
send cookie in response----
res.cookie('token',token,{maxAge:10*60*1000})


logout 
const {token} = req.cookies
const payload = jwt.decode(token)