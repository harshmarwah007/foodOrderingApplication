const User = require("../models/User");
const jwt = require("jsonwebtoken")
const {registerValidation,loginValidation} = require("../validation")
const bcrypt = require("bcryptjs");
const passport = require("passport")
require("../config/passport")
require("dotenv").config()

const register = async(req,res)=>{
    //validating register
    const {error} =  registerValidation(req.body)
    if(error) return res.status(400).json(error.details[0].message)
    //if email exists
    const emailExist = await User.findOne({email:req.body.email})
    const phoneExist = await User.findOne({phone:req.body.phone})
    if(emailExist) return res.status(400).json("Email already exists")
    if(phoneExist) return res.status(400).json("Phone Number already exists")

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt)
    const user = new User({
        name:req.body.name,
        phone:req.body.phone,
        email:req.body.email,
        password:hashPassword
    })
    try{
        const savedPost = await user.save()
        res.json({message:"registered",report:savedPost})
        
    }catch(error){
        res.status(400).json({message:error});
    }
}



const login = async (req,res)=>{
    if(req.body){
        console.log(req.body)
    }
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).json(error.details[0].message);
    const user = await User.findOne({email:req.body.email})
    if(!user) return res.status(400).json({
        success: false,
        message: "Could not find the user."
    })
    const validPassword = await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).json({
        success: false,
        message: "Incorrect password"
    });

    // Create and ssign token
    
    const payload = {
        email: user.email,
        id: user._id
    }

    const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: "1d" })

     res.status(200).json({
        success: true,
        message: "loggedIn",
        token: "Bearer " + token
    })
}


//! When made with passport_local

// const login = (req, res, next) => {
//     passport.authenticate("local", (err, user, info) => {
//       if (err) throw err;
//       if (!user) res.send("No User Exists");
//       else {
//         req.logIn(user, (err) => {
//           if (err) throw err;
//           res.json({message:"loggedIn"}).

//           console.log(req.user);
//         });
//       }
//     })(req, res, next);
//   }
module.exports = {login,register}



// designed firstly from scratch with jwt 
// const login = async (req,res)=>{
//     if(req.body){
//         console.log(req.body)
//     }
//     const {error} = loginValidation(req.body);
//     if(error) return res.status(400).json(error.details[0].message);
//     const user = await User.findOne({email:req.body.email})
//     if(!user) return res.status(400).json("Email is not found")
//     const validPassword = await bcrypt.compare(req.body.password,user.password);
//     if(!validPassword) return res.status(400).json("Invalid Password");

//     // Create and ssign token
    
//     const token = jwt.sign({_id: user._id},process.env.TOKEN_SECRET)

//     res.header("auth-token",token).json(
//     {
//     message:"loggedIn",
//     details:user,
//     token:token
//     })
// }

