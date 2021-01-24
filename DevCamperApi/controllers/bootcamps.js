const Bootcamp=require("../models/Bootcamp");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("../middleware/async");
const geoCoder=require("../utils/geocoder")


//@desc get all bootcamps
//@route GET api/v1/bootcamps
//@access public
exports.getBootcamps=asyncHandler( async (req,res,next)=>{
 let query;

 //copy query
 const reqQuery={...req.query};

 //field to eclude
    const removeFieds=["select"];
    //loop over removeFilds and remove them reqQuery
    removeFieds.forEach(param=>delete reqQuery[param]);
    //console.log(reqQuery);
 //create query string
 let queryStr=JSON.stringify(reqQuery);

 //create operators
 queryStr=queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g,match=>`$${match}`);

 //find resource
    query=Bootcamp.find(JSON.parse(queryStr));

    //select fields
   // console.log(req.query.select)
    if(req.query.select){
       const fields=req.query.select.split(",").join(" ");
       query=query.select(fields);
    };
    if(req.query.sort){
        const sortBy=req.query.sort.split(",").join(" ");
        query=query.sort(sortBy);
    }else{
        query=query.sort("-createdAt");
    }
    //execute query
        const bootcamps=await query;
        res.status(200).json({
            count:bootcamps.length,
            success:true,
            data:bootcamps
        })

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
       const bootcamp=await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
           new:true,
           runValidators:true
       })
       if (!bootcamp){
           return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
       }
});
//@desc get all bootcamps
//@route POST api/v1/bootcamps
//@access public
exports.createBootcamp=asyncHandler( async (req,res,next)=>{
       const bootcamp=await Bootcamp.create(req.body);
       res.status(201).json({
           success:true,
           data:bootcamp
       });
});
//@desc get all bootcamps
//@route DELETE api/v1/bootcamps/:id
//@access public
exports.deleteBootcamp=asyncHandler( async (req,res,next)=>{
        const bootcamp=await Bootcamp.findByIdAndDelete(req.params.id)
        if (!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({
            success:true,
            data:{}
        });
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
