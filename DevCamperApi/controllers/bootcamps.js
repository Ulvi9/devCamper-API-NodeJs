const Bootcamp=require("../models/Bootcamp");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("../middleware/async");
const geoCoder=require("../utils/geocoder");
const path=require("path");


//@desc get all bootcamps
//@route GET api/v1/bootcamps
//@access public
exports.getBootcamps=asyncHandler( async (req,res,next)=>{
 res.status(200).json(res.advancedResults);
})
//@desc get  bootcamp
//@route GET api/v1/bootcamps/:id
//@access public
exports.getBootcamp=asyncHandler( async (req,res,next)=>{
        const bootcamp=await Bootcamp.findById(req.params.id);
        if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({
            success:true,
            data:bootcamp
        })
})
//@desc get all bootcamps
//@route PUT api/v1/bootcamps/:id
//@access public
exports.editBootcamp=asyncHandler(async (req,res,next)=>{
       let bootcamp=await Bootcamp.findById(req.params.id)
       if (!bootcamp){
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
       }
       //make sure user is owner
       if(bootcamp.user.toString()!==req.user.id&&req.user.role!=="admin"){
           return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamps`,401));
       }
     bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
});
//@desc get all bootcamps
//@route POST api/v1/bootcamps
//@access public
exports.createBootcamp=asyncHandler( async (req,res,next)=>{
    //add user to req.body
    req.body.user=req.user.id;
    //check published bootcamp
    const publishedBootcamp=await Bootcamp.findOne({user:req.user.id});
    //if user is not admin only cann add one bootcamp
    if (publishedBootcamp&&req.user.role!=="admin"){
        return next(new ErrorResponse(`the user with ${req.user.id} already published bootcamps`,400));
    };
       const bootcamp=await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       });
});
//@desc delete bootcamp
//@route DELETE api/v1/bootcamps/:id
//@access public
exports.deleteBootcamp=asyncHandler( async (req,res,next)=>{
    const bootcamp=await Bootcamp.findById(req.params.id)
    if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        };
    //make sure user is owner
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this bootcamps`,401));
    }

    bootcamp.remove();
    res.status(200).json({
        success:true,
        data:{}
    });
});

//@desc file uploads
//@route Put api/v1/bootcamps/:id/photo
//@access public
exports.bootcampPhotoUpload=asyncHandler( async (req,res,next)=>{
    const bootcamp=await Bootcamp.findById(req.params.id)
    if (!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    };

    //make sure user is owner
    if(bootcamp.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this bootcamps`,401));
    }

    if (!req.files){
        return next(new ErrorResponse(`Please upload file `,404));
    };
    const file=req.files.file;
    if (!file.mimetype.startsWith("image")){
        return next(new ErrorResponse(`Please upload an image `,400));
    };
    if(file.size>process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than 
        ${process.env.MAX_FILE_UPLOAD} `,404));
    };
    file.name=`poto_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
       if (err){
           return next( new ErrorResponse(`Problem with fileUpload`),500)
       }
    });
    await Bootcamp.findOneAndUpdate(req.params.id,{photo:file.name});
    res.status(200).json({
        success:true,
        data:file.name
    })

});
//@desc get  bootcampInRadius
//@route Get api/v1/bootcamps/:zipcode/:distance
//@access public
exports.getBootcampInRadius=asyncHandler( async (req,res,next)=>{
    const {zipcode,distance}=req.body;
    //get lng lat from geocoder;
    const loc=await geoCoder.geocode(zipcode);
    const lng=loc[0].longitude;
    const lat=loc[0].latitude;
    const radius=distance/3963;
    const bootcamps=await Bootcamp.find({
        location:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}
    });
    res.status(200).json({
        success:true,
        count:bootcamps.length,
        data:bootcamps
    });
})
