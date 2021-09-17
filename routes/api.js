const express=require("express");
const controllers=require("../controllers/controller");
const router=express.Router();
router.post("/postOrder",controllers.postOrder);
router.get("/getPendOrders",controllers.getPendOrders);
router.put("/updateOrder",controllers.updateOrder)
module.exports=router;