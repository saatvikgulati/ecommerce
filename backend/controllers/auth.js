const jwt=require('jsonwebtoken');

const bcrypt=require('bcryptjs');
const User = require('../models/user');

exports.signup=(req,res,next)=>{
  bcrypt.hash(req.body.password,10)
  .then(hash=>{
    const user=new User({
      username:req.body.username,
      password:hash,
    });
    user.save().then(result=>{
      res.status(201).json({
        message:'User Created',
        result:result
      });
    })
    .catch(err=>{
      res.status(500).json({
        message:'Invalid Credentials'
      });
    });
  });
}


exports.login=(req,res,next=>{
  let fetchedUser;
  User.findOne({email:req.body.email})
  .then(user=>{
    if(!user){
      return res.status(401).json({
        message:'Auth Failed'
      });
    }
    fetchedUser=user;
    return bcrypt.compare(req.body.password,user.password);
  })
  .then(result=>{
    if(!result){
      return res.status(401).json({
        message:'Auth Failed'
      });
    }
    const token=jwt.sign({email:fetchedUser.email,userid:fetchedUser.id},
      "seceret",{expiresIn:'1h'}
      );
      res.status(200).json({
        token:token,
        expiresIn:3600,
        userid:fetchedUser.id,
      });
  })
  .catch(err=>{
    return res.status(401).json({
      message:"Invalid auth credentials"
    });
  });
})
