const express=require("express");
const controllers=require("../controllers/controller");
const router=express.Router();
router.post("/postOrder",controllers.postOrder);
module.exports=router;