const Bootcamp=require("../models/Bootcamp");
const Review=require("../models/Review");
const ErrorResponse=require("../utils/errorResponse");
const asyncHandler=require("../middleware/async");

//@desc get all reviews
//@route GET api/v1/reviews
//@route GET api/v1/bootcamps/:bootcamps/reviews
//@access public
exports.getReviews=asyncHandler(async(req,res,next)=>{
    if (req.params.bootcampId){
        const reviews=await Review.find({bootcamp:req.params.bootcampId});
        res.status(200).json({
            success:true,
            count:reviews.length,
            data:reviews
        })
    }else{
        res.status(200).json(res.advancedResults);
    }
});

//@desc get review
//@route GET api/v1/review/:id
//@access public
exports.getReview=asyncHandler(async(req,res,next)=>{
    const review=await Review.findById(req.params.id).populate({
        path:"bootcamps",
        select:"name description"
    })
    if (!review){
        return next(new ErrorResponse(`review not found with ${req.params.id}`,404))
    }
    res.status(200).json({
        success:true,
        data:review
    })
});


//@desc add review
//@route GET api/v1/bootcamp/:bootcampId/reviews
//@access public
exports.addReview=asyncHandler(async(req,res,next)=>{
   req.body.bootcamp=req.params.bootcampId;
   req.body.user=req.user.id;
   const bootcamp=await Bootcamp.findById(req.params.bootcampId);
   if (!bootcamp){
       return next(new ErrorResponse(`not found bootcamp id of the ${req.params.bootcampId}`,404))
   }
   const review=await Review.create(req.body);
    res.status(200).json({
        success:true,
        data:review
    })
});

//@desc updatereview
//@route PUT api/v1/bootcamp/reviews/:id
//@access public
exports.updateReview=asyncHandler(async(req,res,next)=>{
    let review = await Review.findById(req.params.id);
    if (!review){
        return next(new ErrorResponse(`not found review id of the ${req.params.id}`,404));
    };
    if (review.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse(`Not authorized to update view`,401))
    }
   review=await Review.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({
        success:true,
        data:review
    })
});
//@desc deletereview
//@route DELETE api/v1/bootcamp/reviews/:id
//@access public
exports.deleteReview=asyncHandler(async(req,res,next)=>{
    const review = await Review.findById(req.params.id);
    if (!review){
        return next(new ErrorResponse(`not found review id of the ${req.params.id}`,404));
    };
    if (review.user.toString()!==req.user.id&&req.user.role!=="admin"){
        return next(new ErrorResponse(`Not authorized to update view`,401))
    }
   await review.remove();
    res.status(200).json({
        success:true,
        data:{}
    })
});
