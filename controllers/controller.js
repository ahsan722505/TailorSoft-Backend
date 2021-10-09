const Order=require("../models/Order")
const Owner=require("../models/Owner")
const Client=require("../models/Client")
const nodemailer = require('nodemailer');
const jwt=require("jsonwebtoken");
const sendMail=require("../helpers/helpers").sendMail;
require("dotenv").config()

exports.postOrder=(req,res,next)=>{
    
    if(req.query.existing == "true"){
        
        const update={name : req.body.name,
            email :req.body.email,
            measurements : req.body.measurements}
            const filter={_id : req.body.clientId}
            Client.findOneAndUpdate(filter,update,{new : true}).then(client=>{
                
                req.clientData=client
                next()
            }).catch(err=>{
                if(!err.statusCode) err.statusCode=500;
                next(err)
            })
    }
    else{
        
        const client=new Client({
            name : req.body.name,
            email :req.body.email,
            measurements : req.body.measurements,
            ownerId : req.body.ownerId
        })
        

    
    client.save().then(result=>{
        
        
        
        req.clientData=result;
        next();
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
    
}
exports.getPendOrders=(req,res,next)=>{
    Order.find({pending : true , ownerId : req.query.ownerId}).populate("clientId").exec().then((orders)=>{
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
    Order.findOneAndUpdate(filter,update,{new : true}).then((order)=>{
        
        Client.findById(order.clientId).then(client=>{
            sendMail(client.email,"order completion","Your order is completed kindly pick it up").then(info=>{
                    // pass
            }).catch(err=>{
                // pass
            })
        }).catch((err)=>{
            console.log(err);
        })
        res.status(200).json({success : true})
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.getClient=(req,res,next)=>{
    const clientName=req.query.name;
    Client.find({ name : { $regex: new RegExp(clientName), $options: 'i' } , ownerId : req.query.ownerId }).then(clients=>{
        // console.log(clients);
        res.status(200).json({clients : clients});
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.makeOrders=(req,res,next)=>{
    const order=new Order({
        returnDate : req.body.returnDate,
        price : req.body.price,
        cloth : req.body.cloth,
        pending : true,
        ownerId : req.body.ownerId,
        clientId : req.clientData._id
    })
    order.save().then((result)=>{
        result.clientId=req.clientData;
        
        res.status(201).json({clientData : result})
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.postMail=(req,res,next)=>{
    
    sendMail(req.body.email,req.body.subject,req.body.mail).then(info=>{
        res.status(200).json({success : true});
    }).catch(err=>{
        if(!err.statusCode) err.statusCode=500;
        next(err)
    })
}
exports.getAuthState=(req,res,next)=>{
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ authenticated: false });
      return;
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, owner) => {
      if (err || !owner) {
        res.status(401).json({ authenticated: false });
        return;
      }
      res.status(200).json({authenticated : true , email : owner.email , username : owner.username , ownerId : owner._id})
    });
    
}
exports.postSignUp=(req,res,next)=>{
    console.log("request here");
    
        let usernameExist;
        let emailExist;
        Owner.findOne({ email: req.body.email })
          .then((owner) => {
            if (owner) {
              emailExist = true;
            } else {
              emailExist = false;
            }
            Owner.findOne({ username: req.body.username })
              .then((owner) => {
                if (owner) {
                  usernameExist = true;
                } else {
                  usernameExist = false;
                }
                if (usernameExist && !emailExist) {
                  res.status(401).json({message : "username already exists"});
                } else if (emailExist && !usernameExist) {
                  res.status(401).json({message : "email already exists"});
                } else if (emailExist && usernameExist) {
                  res.status(401).json({message :"username and email already exists."});
                } else {
                  const owner = new Owner(req.body);
                  owner
                    .save()
                    .then((owner) => {
                      const accessToken = jwt.sign(
                        {
                          _id: owner._id,
                          username: owner.username,
                          email: owner.email,
                          
                        },
                        process.env.ACCESS_TOKEN_SECRET
                      );
                      res.status(201).json({
                        accessToken: accessToken,
                        username : owner.username,
                        email : owner.email,
                        ownerId : owner._id,
                        
                      });
                    })
                    .catch((err) => {
                      if(!err.statusCode) err.statusCode=500;
        next(err)
                    });
                }
              })
              .catch((err) => {
                if(!err.statusCode) err.statusCode=500;
        next(err)
              });
          })
          .catch((err) => {
            if(!err.statusCode) err.statusCode=500;
        next(err)
          });
      
}
exports.postLogin = (req, res, next) => {
    Owner.findOne({
      password: req.body.password,
      $or: [{ email: req.body.emailOrUser }, { username: req.body.emailOrUser }],
    })
      .then((owner) => {
        
        if (!owner) {
          res.status(401).json({message : "invalid credentials"});
        } else {
          
          const accessToken = jwt.sign(
            {
              _id: owner.id,
              username: owner.username,
              email: owner.email,
              
            },
            process.env.ACCESS_TOKEN_SECRET
          );
          
          res.status(200).json({
            accessToken: accessToken,
            username : owner.username,
            email : owner.email,
            ownerId : owner._id,
            
          });
        }
      })
      .catch((err) => {
        if(!err.statusCode) err.statusCode=500;
    next(err)
      });
  };
exports.changePassword=(req,res,next)=>{
  console.log("request coming");
  Owner.findOne({_id : req.query.ownerId}).then(owner=>{
    if(!owner){
      res.status(401).json({message : "no owner"});
      return;
    }
    if(owner.password !== req.body.currentPassword){
      res.status(401).json({message : "invalid password"});
      return;
    }
    owner.password=req.body.newPassword;
    owner.save().then(data=>{
      res.status(200).json({message : "success"});
    }).catch((err) => {
      if(!err.statusCode) err.statusCode=500;
  next(err)
    })

  }).catch((err) => {
    if(!err.statusCode) err.statusCode=500;
next(err)
  })
}