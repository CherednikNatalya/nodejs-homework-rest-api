const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const subscriptionList = ["starter", "pro", "business"];

const userSchema = new Schema(
    {
        password: {
          type: String,
          required: [true, 'Set password for user'],
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: subscriptionList,
          default: "starter"
        },
        token: String
      },
      {versionKey: false, timestamps: true}
  );

  userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({

name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

email: Joi.string().pattern(emailRegexp).required(),

password: Joi.string().min(6).required(),
  })


const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),

password: Joi.string().min(6).required(),
  })

  const schemas ={
    loginSchema,
    registerSchema,
  }

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
    subscriptionList,
}