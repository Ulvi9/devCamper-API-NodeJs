const express=require("express");
const {
    register,
    login,
    logout,
    getMe,
    forgetPassword,
    resetPassword,
    updateDetails,
    updatePassword
}=require("../controllers/auth")
const router=express.Router();
const {protect}=require('../middleware/auth')
router.post("/register",register);
router.post("/login",login);
router.get("/me",protect,getMe);
router.post("/forgetpassword",forgetPassword);
router.put("/resetpassword/:resettoken",resetPassword);
router.put("/updatedetails",protect,updateDetails);
router.put("/updatepassword",protect,updatePassword);
router.get("/logout",logout)
module.exports=router;
