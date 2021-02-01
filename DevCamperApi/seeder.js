const fs =require("fs");
const colors=require("colors");
const mongoose=require("mongoose");
const dotenv=require("dotenv");

dotenv.config({path:"./config/config.env"});
 //load models
const Bootcamps=require("./models/Bootcamp");
const Courses=require("./models/Course");
const Users=require("./models/User");
const Reviews=require("./models/Review");

//connect to db
mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true
});

const bootcamps=JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`,"utf-8"));
const courses=JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`,"utf-8"));
const users=JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`,"utf-8"));
const reviews=JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`,"utf-8"));
//import into db
const importData=async ()=>{
    try {
        await Bootcamps.create(bootcamps);
        await Courses.create(courses);
        await Users.create(users);
        await Reviews.create(reviews);
        console.log("Data ipmorted".green.inverse);
        process.exit();
    }catch (e) {
        console.log(e)
    }
}
//delete from db

const destroyData=async ()=>{
    try {
        await Bootcamps.deleteMany();
        await Courses.deleteMany();
        await Users.deleteMany();
        await Reviews.deleteMany();
        console.log("Data deleted".red.inverse)
        process.exit();
    }catch (e) {
        console.log(e)
    };
}
if (process.argv[2]==="-i"){
    importData();
}else if(process.argv[2]=="-d"){
    destroyData();
}
