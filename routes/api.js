const express=require("express");
const controllers=require("../controllers/controller");
const router=express.Router();
router.post("/postOrder",controllers.postOrder);
router.get("/getPendOrders",controllers.getPendOrders);
router.put("/updateOrder",controllers.updateOrder);
router.delete("/deleteOrder",controllers.deleteOrder)
router.patch("/completeOrder",controllers.completeOrder);
router.get("/getClient",controllers.getClient);
module.exports=router;