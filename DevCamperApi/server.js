const express=require("express");
const dotenv=require("dotenv");
const morgan=require("morgan");
const colors=require("colors");
const errorHandler=require("./middleware/error");
const connectDb=require("./config/db");
const fileupload=require("express-fileupload");
const path=require("path");
const cookieParser=require("cookie-parser");
const mongoSanitize=require("express-mongo-sanitize");
const helmet=require("helmet");
const xss=require("xss-clean");
const rateLimit=require("express-rate-limit");
const hpp=require("hpp");
const cors=require("cors");


//load end vars
dotenv.config({path:"./config/config.env"});
const app=express();

//connect to db
 connectDb();

 //route files
const bootcamps=require("./routes/bootcamps");
const courses=require("./routes/courses");
const auth=require("./routes/auth");
const users=require("./routes/users");
const reviews=require("./routes/reviews")

//body parser
app.use(express.json())
//cookie parser
app.use(cookieParser());
//logging with morgan middleware
if (process.env.NODE_ENV==="development"){
    app.use(morgan("dev"));
};

//file uploads
app.use(fileupload());

//sanitize data
app.use(mongoSanitize());

//set security headers
app.use(helmet());

//prevent xss attacks
app.use(xss());

//rate limiting
const limiter=rateLimit({
    windowMs:10*600*1000, //10 mins
    max:1
})
app.use(limiter);

//prevent http parram pollution
app.use(hpp());

//enable cors
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname,"public")));
//mount routers
app.use("/api/v1/bootcamps",bootcamps);
app.use("/api/v1/courses",courses);
app.use("/api/v1/auth",auth);
app.use("/api/v1/users",users);
app.use("/api/v1/reviews",reviews);
app.use(errorHandler);

//listen port
const PORT=process.env.PORT||5000;
const server=app.listen(PORT,()=>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


//handle unhandled  promise rejection
process.on("unhandledRejection",(err,promise)=>{
    console.log(`Error ${err.message}`.red.bold)
    server.close(()=>process.exit(1))
})
