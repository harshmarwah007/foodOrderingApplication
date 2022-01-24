const Joi = require("@hapi/joi");


const registerValidation = (data)=>{
    const schema = Joi.object({
        name:Joi.string().required(),
        phone:Joi.string().length(10).pattern(/^[0-9]+$/),
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required()
        
    })  

    return schema.validate(data)
}

const loginValidation = (data)=>{
    const schema = Joi.object({
        email:Joi.string().min(6).required().email(),
        password:Joi.string().min(6).required()
    })  
    
    return schema.validate(data)
}
module.exports = {registerValidation,loginValidation}
