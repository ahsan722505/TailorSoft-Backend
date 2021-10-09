const express=require("express");
const controllers=require("../controllers/controller");
const router=express.Router();
router.post("/postOrder",controllers.postOrder,controllers.makeOrders);
router.get("/getPendOrders",controllers.getPendOrders);
router.put("/updateOrder",controllers.updateOrder);
router.delete("/deleteOrder",controllers.deleteOrder)
router.patch("/completeOrder",controllers.completeOrder);
router.get("/getClient",controllers.getClient);
router.post("/postMail",controllers.postMail);
router.get("/getAuthState",controllers.getAuthState);
router.post("/postSignUp",controllers.postSignUp)
router.post("/postLogin",controllers.postLogin)
module.exports=router;