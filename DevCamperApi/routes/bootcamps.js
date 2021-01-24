const express=require("express");
const {
    getBootcamp,
    getBootcamps,
    editBootcamp,
    createBootcamp,
    deleteBootcamp,
    getBootcampInRadius
} =require("../controllers/bootcamps")
const router=express.Router();


router.route("/")
    .get(getBootcamps)
    .post(createBootcamp);

router.route("/:id")
    .get(getBootcamp)
    .put(editBootcamp)
    .delete(deleteBootcamp)
router.route("/radius/:zipcode/:distance").get(getBootcampInRadius);
module.exports=router;
