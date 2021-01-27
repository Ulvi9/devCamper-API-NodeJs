const Bootcamp=require("../models/Bootcamp");
const Course=require("../models/Course");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("../middleware/async");


//@desc get all courses
//@route GET api/v1/courses
//@route GET api/v1/bootcamps/:bootcamps/courses
//@access public
exports.getCourses=asyncHandler(async(req,res,next)=>{
if (req.params.bootcampId){
    const courses=Course.find({bootcamp:req.params.bootcampId});
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
}else{
    res.status(200).json(res.advancedResults);
}
const courses=await query;
    res.status(200).json({
        success:true,
        count:courses.length,
        data:courses
    })
});
//@desc get single course
//@route GET api/v1/course/:id
//@access public
exports.getCourse=asyncHandler(async(req,res,next)=>{
    const course=await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name decription"
    });
    if (!course){
        next(new ErrorResponse(`course did not find with ${req.params.id}`),404)
    }
    res.status(200).json({
        success:true,
        data:course
    })
});
//@desc get single course
//@route Post api/v1/bootcamp/:bootcampId/course
//@access private
exports.addCourse=asyncHandler(async(req,res,next)=>{
    req.body.bootcamp=req.params.bootcampId;
    const bootcamp=await Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp){
        next(new ErrorResponse(`bootcamp did not find with ${req.params.bootcampId}`),
        404
        )
    }
    const course=await  Course.create(req.body);
    res.status(200).json({
        success:true,
        data:course
    })
});

//@desc update course
//@route GET api/v1/course/:id
//@access public
exports.updateCourse=asyncHandler(async(req,res,next)=>{
    let course=await Course.findById(req.params.id).populate({
        path:"bootcamp",
        select:"name decription"
    });
    if (!course){
        next(new ErrorResponse(`course did not find with ${req.params.id}`),404)
    }
    course=await Course.findByIdAndUpdate(req.params.id,req.body,{
        runValidators:true,
        new:true
    })
    res.status(200).json({
        success:true,
        data:course
    })
});

//@desc delete course
//@route Delete api/v1/course/:id
//@access public
exports.deleteCourse=asyncHandler(async(req,res,next)=>{
    const course=await Course.findById(req.params.id);
    if (!course){
        next(new ErrorResponse(`course did not find with ${req.params.id}`),404)
    }
    await course.remove();
    res.status(200).json({
        success:true,
        data:{}
    })
});