const express=require("express");
const {
    getBootcamp,
    getBootcamps,
    editBootcamp,
    createBootcamp,
    deleteBootcamp,
    getBootcampInRadius,
    bootcampPhotoUpload
} =require("../controllers/bootcamps");
const {protect,authorize}=require("../middleware/auth");
const Bootcamp=require("../models/Bootcamp");
//include others resources
const courseRouter=require("./courses");
const reviewRouter=require("./reviews")

const router=express.Router();
const advancedResults=require("../middleware/advancedResults")
//re-route
router.use("/:bootcampId/courses",courseRouter);
router.use("/:bootcampId/reviews",reviewRouter)

router.route("/")
    .get(advancedResults(Bootcamp,"courses"), getBootcamps)
    .post(protect,authorize('publisher','admin'),createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(protect,authorize('publisher','admin'),editBootcamp)
    .delete(protect,authorize('publisher','admin'),deleteBootcamp)
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/:id/photo").put(protect,authorize('publisher','admin'),bootcampPhotoUpload);
module.exports=router;
