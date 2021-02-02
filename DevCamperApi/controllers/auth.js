const User=require("../models/User");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("../middleware/async");
const sendEmail=require("../utils/sendEmail");
const crypto=require("crypto");

//@desc Register user
//@route Post api/v1/auth/register
//@access public
exports.register=asyncHandler(async (req,res,next)=>{
    const {name,password,role,email}=req.body;
    const user=await User.create({
        name,
        password,
        role,
        email
    })
    sendTokenResponse(user,200,res);
});
//@desc Login user
//@route Post api/v1/auth/login
//@access public
exports.login=asyncHandler(async (req,res,next)=>{
    const {password,email}=req.body;
   //validate email and password
    if (!email||!password){
        return next(new ErrorResponse("Please provide email and password",400));
    }
    //check for users
    const user=await User.findOne({email}).select("+password");
    if (!user){
        return next(new ErrorResponse("Invalid Credential",401));
    }
    //if password matches
    const isMatch=await user.matchPassword(password);
    if (!isMatch){
        return next(new ErrorResponse("Invalid Credential",401))
    }
    sendTokenResponse(user,200,res);
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
    // user is already available in req due to the protect middleware
   // const user = req.user;
    const user=await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user,
    });
});
// @desc      log out clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private

exports.logout = asyncHandler(async (req, res, next) => {
    res.cookie("token","none",{
        expires:new Date(Date.now()+10*100),
        httpOnly:true
    });
    res.status(200).json({
        success: true,
        data: {},
    });
});
// @desc      Update user details
// @route     PUT  /api/v1/auth/usepdatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
    const updatedDetails={
        name:req.body.name,
        email:req.body.email
    }
    const user=await User.findOneAndUpdate(req.user.id,updatedDetails,{
        new:true,
        runValidators:true
    });

    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc      Update user details
// @route     PUT  /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

    const user=await User.findById(req.user.id).select("+password");
   if (!(await user.matchPassword(req.body.currentPassword))){
       return next(new ErrorResponse("Password is Incorrect",401))
   }
   user.password=req.body.newPassword;
   await user.save();
    sendTokenResponse(user,200,res);
});
// @desc      Forget Password
// @route     GET /api/v1/auth/forgetpassword
// @access    Public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
   const user=await User.findOne({email:req.body.email});
   if (!user){
       return next(new ErrorResponse("There is no user with that email",400));
   }
   const resetToken=user.getResetPasswordToken();
   // console.log(resetToken);
    //create reset url;
    const resetUrl=`${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const message=`You are recieving this email you has requested the reset of password.
    Please make a put request to \n\n ${resetUrl}`
    try {
        await  sendEmail({
            email:user.email,
            subject:"Password reset token",
            message
        })
        res.status(200).json({success:true,data:"Email sent"});
    }catch (e){
        console.log(e);
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save({validateBeforeSave:false});
        return next(new ErrorResponse("Email could not be sent",500));
    }
    await user.save({validateBeforeSave:false})
    res.status(200).json({
        success: true,
        data: user,
    });
});

// @desc      ResetPassword
// @route     Put /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
   //get hashed token
   // console.log(req.params.resettoken)
    const resetPasswordToken=crypto
        .createHash('sha256')
        .update(req.params.resettoken)
        .digest('hex');
    const user=await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{
         $gt:Date.now()
        }
    });
    if (!user){
        return next(new ErrorResponse("invalid token",400));
    }
    //set new password
    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendTokenResponse(user,200,res);
});
// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
        ),
        httpOnly: true,
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
    });
};

