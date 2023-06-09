const nodemailer = require('nodemailer');
require('dotenv').config();

const {META_PASSWORD} = process.env;

const nodemailerConfig ={
    host: 'smtp.meta.ua',
    port: 465,
    secure: true,
    auth: {
      user: 'cherednik.natalya@meta.ua',
      pass: META_PASSWORD
    }, 
}

const transport = nodemailer.createTransport(nodemailerConfig)

// const emailOptions = {
//     from: 'cherednik.natalya@meta.ua',
//     to: 'cherednik.natalya@gmail.com',
//     subject: 'Nodemailer test',
//     text: 'Привіт. Ми тестуємо надсилання листів!',
//   };
  


   
const sendEmail = async (data) => {
    const email = { ...data, from: 'cherednik.natalya@meta.ua'};
    await transport.sendMail(email);
    console.log("Email send success");
    return true;
  };
  
  module.exports = sendEmail;