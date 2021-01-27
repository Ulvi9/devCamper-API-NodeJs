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
const Bootcamp=require("../models/Bootcamp");
//include others resources
const courseRouter=require("./courses")

const router=express.Router();
const advancedResults=require("../middleware/advancedResults")
//re-route
router.use("/:bootcampId/courses",courseRouter)

router.route("/")
    .get(advancedResults(Bootcamp,"courses"), getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp)
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
router.route("/:id/photo").put(bootcampPhotoUpload);
module.exports=router;
