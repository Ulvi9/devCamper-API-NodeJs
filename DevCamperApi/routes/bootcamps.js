const express=require("express");
const {
    getBootcamp,
    getBootcamps,
    editBootcamp,
    createBootcamp,
    deleteBootcamp,
    getBootcampInRadius
} =require("../controllers/bootcamps");

//include others resources
const courseRouter=require("./courses")

const router=express.Router();

//re-route
router.use("/:bootcampId/courses",courseRouter)

router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp)
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
module.exports=router;
