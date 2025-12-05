const Joi = require("joi");
//used joi to handle errors 

module.exports.TaskSchema=Joi.object({
    
        title:Joi.string().required(),
        subject:Joi.string().required(),
        description:Joi.string().required(),
        dueDate:Joi.date().required(),
        priority:Joi.string().required(),
        status:Joi.string().required(),

    
})
module.exports.UpdateSchema=Joi.object({
        description:Joi.string().required(),
        status:Joi.string().required(),

})
