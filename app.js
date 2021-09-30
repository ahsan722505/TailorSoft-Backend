const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config()
const app=express();
app.use(cors());
app.use(express.json());
const apis=require("./routes/api");
app.use((req,res,next)=>{
    // console.log("request coming..")
    req.email="ahsantahir722505@gmail.com";
    req.clientId="6141a67bd3cbf4ca915ef83d";
    next()
})
app.use("/api",apis);
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message});
  });

mongoose.connect(process.env.MONGO_URI).then((result)=>{
    console.log("connected to database");
    app.listen(7000);
}).catch((err)=>{
    console.log(err)
})