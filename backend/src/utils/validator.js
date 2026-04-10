const validator = require('validator')

const validate = (data)=>{

    const mandatoryFiled = ['firstName','emailId','password']
    const isAllowed = mandatoryFiled.every((k)=>Object.keys(data).includes(k));
    
    if(!isAllowed)
    {
        throw new Error("Some fields are missing")
    }
    if(!validator.isEmail(data.emailId))
        throw new Error("invalid email")

    if(!validator.isStrongPassword(data.password))
        throw new Error("Weak Password")

    
}
module.exports = validate