const express=require("express");
const advancedResults=require("../middleware/advancedResults");
const Review=require("../models/Review")
const {
    getReviews,
    getReview,
    addReview,
    updateReview,
    deleteReview

} =require("../controllers/reviews");
const {protect,authorize}=require("../middleware/auth")
const router=express.Router({mergeParams:true});
router.route("/")
    .get(advancedResults(Review,{
        path:"bootcamp",
        select:"name description"
    }),getReviews)
    .post(protect,authorize("admin","user"),addReview);
router.route("/:id")
    .get(getReview)
    .put(protect,authorize("admin","user"),updateReview)
    .delete(protect,authorize("admin","user"),deleteReview);
module.exports=router;
