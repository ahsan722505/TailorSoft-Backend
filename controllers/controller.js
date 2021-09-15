const Order=require("../models/Order")
const Owner=require("../models/Owner")
const Client=require("../models/Client")

exports.postOrder=(req,res,next)=>{
    // console.log(req.body)
    const client=new Client({
        name : req.body.name,
        email :req.body.email,
        measurements : req.body.measurements
    })
    client.save().then(result=>{
        // console.log(result)
        const order=new Order({
            returnDate : req.body.returnDate,
            price : req.body.price,
            cloth : req.body.cloth,
            pending : true,
            ownerId : req.clientId,
            clientId : result._id
        })
        order.save().then((result)=>{
            res.status(201).json({success : true})
        }).catch(err=>{
            if(!err.statusCode) err.statusCode=500;
            next(err)
        })
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
    
}