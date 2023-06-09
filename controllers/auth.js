const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar =require('gravatar');
const path = require('path');
const fs = require('fs').promises;
// const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const {User, subscriptionList} = require('../models/user');
const { HttpError, ctrlWrapper, sendEmail} = require("../helpers");

const {SECRET_KEY, BASE_URL} = process.env;

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

// const updateImgAvatar = async (path) => {
//   const avatar = await Jimp.read(path);
//   avatar.resize(250, 250);
//   await avatar.writeAsync(path);
// };


const register = async (req, res) => {
const {email, password} =req.body;
const user = await User.findOne({email});

if(user) {
    throw  HttpError(409, 'Email already in use');
}

const hashPassword = await bcrypt.hash(password, 10);
const avatarURL = gravatar.url(email);
const verificationToken = nanoid();
    
const newUser = await User.create({...req.body, password:hashPassword, avatarURL, verificationToken});

const verifyEmail ={
  to:email,
  subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
}

await sendEmail(verifyEmail);

res.status(201).json({
    email: newUser.email,
    name: newUser.name,
})
}

const verifyEmail =async (req, res) => {
const {verificationToken} = req.params;
const user = await User.findOne({verificationToken});
if(!user){
  throw  HttpError(404, 'Email not found');
}
await User.findByIdAndUpdate(user._id, {
  verify: true,
  verificationToken: null,
});

res.json ({
  message:'Verification successful'
})
}

const resentVerifyEmail = async (req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});

if(!user){
  throw  HttpError(404, 'Email not found');
}
if(user.verify){
  throw  HttpError(404, 'Email already verify');
}

const verifyEmail = {
  to:email,
  subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
}
await sendEmail(verifyEmail);

res.json({
  message:'Varify email send'
})

}

const login = async(req, res) =>{
    const {email, password} =req.body;
    const user = await User.findOne({email});
    if(!user){
        throw  HttpError(401, 'Email or password invalid');
    }

    if (!user.verify){
      throw  HttpError(401, 'Email not verified');
    }

    const passwordCompare = await  bcrypt.compare(password, user.password);
    if(!passwordCompare){
        throw  HttpError(401, 'Email or password invalid');
    }
    
  const payload = {
    id: user._id,
  }

  const token =jwt.sign(payload, SECRET_KEY, {expiresIn: '23h'});
await User.findByIdAndUpdate(user._id, {token});

    res.json ({
        token,
    })
}

const getCurrent =async(req, res) =>{
    const {email, subscription } =req.user;
    res.json ({
      email, 
      subscription 
    })
}

const logout = async(req, res) => {
    const {_id} =req.user;
    await User.findByIdAndUpdate(_id, {token:''});
    res.json ({
        message: 'Logout success'
    })

}

const updateAvatar = async(req, res)=> {
  const {_id} = req.user;
  const {path: tempUpload, originalname} = req.file;
  const filename = `${_id}_${originalname}`;
  
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);

  const avatarURL = path.join("avatars", filename);
  await User.findByIdAndUpdate(_id, {avatarURL});

  res.json({
      avatarURL,
  })
}


const updateSubscription = async (req, res) => {
    const errorSubscription = new HttpError(400, "Invalid subscription value");
    const { subscription } = req.body;
    const { _id: userId } = req.user;
  
    if (!subscription || !subscriptionList.includes(subscription)) {
      throw errorSubscription;
    }
  
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { subscription },
      { new: true }
    );
    res.json({
      user: {
        email: updatedUser.email,
        subscription: updatedUser.subscription,
      },
    });
  };

module.exports = {
    register: ctrlWrapper(register),
    login:ctrlWrapper(login),
    getCurrent:ctrlWrapper(getCurrent),
    logout:ctrlWrapper(logout),
    updateSubscription :ctrlWrapper(updateSubscription ),
    updateAvatar: ctrlWrapper(updateAvatar),
    verifyEmail: ctrlWrapper(verifyEmail),
    resentVerifyEmail: ctrlWrapper(resentVerifyEmail),
  };
  
