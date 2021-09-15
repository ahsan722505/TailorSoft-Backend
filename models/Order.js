const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema=new Schema({
    ownerId :{
        type: Schema.Types.ObjectId,
    required: true,
    ref: "Owner",
    },
    clientId :{
        type: Schema.Types.ObjectId,
    required: true,
    ref: "Client",
    },
    price :{
        type : String,
        required : true
    },
    returnDate :{
        type : Date,
        required : true,
    },
    cloth :{
        type : String,
        required : true
    },
    pending : {
        type : Boolean,
        required : true,
    }
},{timestamps : true})
module.exports=mongoose.model("Order",orderSchema)