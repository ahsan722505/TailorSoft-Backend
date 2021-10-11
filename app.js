const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
require("dotenv").config()
const app=express();
app.use(cors());
app.use(express.json());
const apis=require("./routes/api");

app.use("/api",apis);
app.use((error, req, res, next) => {
    
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message});
  });

mongoose.connect(process.env.MONGO_URI).then((result)=>{
    console.log("connected to database");
    app.listen(process.env.PORT || 8080);
}).catch((err)=>{
    console.log(err)
})