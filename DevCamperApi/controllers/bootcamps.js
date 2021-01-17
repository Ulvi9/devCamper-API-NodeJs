const Bootcamp=require("../models/Bootcamp");

//@desc get all bootcamps
//@route GET api/v1/bootcamps
//@access public
exports.getBootcamps=async (req,res,next)=>{
    try {
        const bootcamps=await Bootcamp.find();
        res.status(200).json({
            count:bootcamps.length,
            success:true,
            data:bootcamps
        })
    } catch (e) {
        res.status(400).json({
            success:false,
        })
    }

}
//@desc get  bootcamp
//@route GET api/v1/bootcamps/:id
//@access public
exports.getBootcamp=async (req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.findById(req.params.id);
        if (!bootcamp){
            return res.status(400).json({success:false})
        }
        res.status(200).json({
            success:true,
            data:bootcamp
        })
    } catch (e) {
        res.status(400).json({
            success:false,
        })
    }
}
//@desc get all bootcamps
//@route PUT api/v1/bootcamps/:id
//@access public
exports.editBootcamp=async (req,res,next)=>{
   try {
       const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
           new:true,
           runValidators:true
       })
       if (!bootcamp){
           res.status(400).json({success:false});
       }
       res.status(200).json({
           success:true,
           data:bootcamp
       })
   } catch (e) {
       res.status(400).json({success:false});
   }
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
exports.deleteBootcamp=async (req,res,next)=>{
    try {
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp){
            res.status(400).json({success:false});
        }
        res.status(200).json({
            success:true,
            data:{}
        })
    } catch (e) {
        res.status(400).json({success:false});
    }
}
