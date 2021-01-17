const Bootcamp=require("../models/Bootcamp");

//@desc get all bootcamps
//@route GET api/v1/bootcamps
//@access public
exports.getBootcamps=(req,res,next)=>{
    res.status(200).json({success:true,msg:"show all bootcamps"})
}
//@desc get  bootcamp
//@route GET api/v1/bootcamps/:id
//@access public
exports.getBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:"show bootcamp"})
}
//@desc get all bootcamps
//@route PUT api/v1/bootcamps/:id
//@access public
exports.editBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:"edit  bootcamp"})
}
//@desc get all bootcamps
//@route POST api/v1/bootcamps
//@access public
exports.createBootcamp=async (req,res,next)=>{
   try {
       const bootcamp=await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       })
   }
   catch (e) {
       res.status(400).json({
           success:false
       })
   }
}
//@desc get all bootcamps
//@route DELETE api/v1/bootcamps/:id
//@access public
exports.deleteBootcamp=(req,res,next)=>{
    res.status(200).json({success:true,msg:"delete bootcamp"})
}
