const bcrypt =  require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar =require('gravatar');
const path = require('path');
const fs = require('fs').promises;
// const Jimp = require("jimp");

const {User, subscriptionList} = require('../models/user');
const { HttpError, ctrlWrapper } = require("../helpers");

const {SECRET_KEY} = process.env;

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
    
const newUser = await User.create({...req.body, password:hashPassword, avatarURL});

res.status(201).json({
    email: newUser.email,
    name: newUser.name,
})
}

const login = async(req, res) =>{
    const {email, password} =req.body;
    const user = await User.findOne({email});
    if(!user){
        throw  HttpError(401, 'Email or password invalid');
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
  };
  
