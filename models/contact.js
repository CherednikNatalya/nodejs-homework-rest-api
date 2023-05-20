const {Schema, model} = require('mongoose');

const Joi = require('joi');

const {handleMongooseError} = require('../helpers/handleMongooseError')

// схема- вимоги до обєктів
const contactSchema = new Schema( {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: [true, 'Set email for contact'],
    },
    phone: {
      type: String,
      required: [true, 'Set phone for contact'],
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  })

  contactSchema.post("save", handleMongooseError);

  const schema =Joi.object({
    name: Joi.string()
         .alphanum()
         .min(3)
         .max(30)
         .required(),
  
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),
    
    phone: Joi.string()
        .min(13)
        .pattern(
              /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/
              )
        .required(),
        favorite: Joi.boolean()
  })
  

// модель- клас, який буде працювати з колекцією
const Contact = model('contact', contactSchema);


module.exports = {
  Contact,
  schema, 
};




