const express=require("express");
const dotenv=require("dotenv");
const morgan=require("morgan");
const colors=require("colors")
const connectDb=require("./config/db")

//load end vars
dotenv.config({path:"./config/config.env"});
const app=express();

//connect to db
 connectDb();

//route files
const bootcamps=require("./routes/bootcamps");

//body parser
app.use(express.json())
//logging with morgan middleware
if (process.env.NODE_ENV=="development"){
    app.use(morgan("dev"));
};

//mount routers
app.use("/api/v1/bootcamps",bootcamps);


//listen port
const PORT=process.env.PORT||5000;
const server=app.listen(PORT,()=>
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold));


//handle unhandled  promise rejection
process.on("unhandledRejection",(err,promise)=>{
    console.log(`Error ${err.message}`.red.bold)
    server.close(()=>process.exit(1))
})