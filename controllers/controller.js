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
    let clientData;
    client.save().then(result=>{
        clientData=result;
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
            result.clientId=clientData;
            
            res.status(201).json({clientData : result})
        }).catch(err=>{
            if(!err.statusCode) err.statusCode=500;
            next(err)
        })
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
    
}
exports.getPendOrders=(req,res,next)=>{
    Order.find({pending : true}).populate("clientId").exec().then((orders)=>{
        // console.log(orders)
        res.status(200).json({orders : orders})
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.updateOrder=(req,res,next)=>{
    let clientData;
    const update={name : req.body.name,
        email :req.body.email,
        measurements : req.body.measurements}
        const filter={_id : req.body.clientId}
    Client.findOneAndUpdate(filter,update,{new : true}).then((client)=>{
        clientData=client
        const update={returnDate : req.body.returnDate,
            price : req.body.price,
            cloth : req.body.cloth,
            }
            const filter={_id : req.body.orderId }
            Order.findOneAndUpdate(filter,update,{new : true}).then((order)=>{
                    order.clientId=clientData;
                    res.status(201).json({clientData : order})
                    console.log(order)
            }).catch(err=>{
                if(!err.statusCode) err.statusCode=500;
                next(err)
            })
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.deleteOrder=(req,res,next)=>{
    // console.log("deleting")
    // console.log(req.body.orderId);
    Order.findByIdAndDelete(req.body.orderId).then(()=>{
        // console.log("success")
        res.status(200).json({success : true})
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.completeOrder=(req,res,next)=>{
    const filter={_id : req.body.orderId};
    const update={pending : false}
    Order.findOneAndUpdate(filter,update).then(()=>{
        res.status(200).json({success : true})
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
