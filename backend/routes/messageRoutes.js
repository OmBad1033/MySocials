import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessages, getConversations } from "../controllers/messageController.js";

const router = express.Router();
router.get("/conversations",protectRoute, getConversations);
router.post("/",protectRoute, sendMessage);
router.get("/:otherUserId", protectRoute, getMessages);


export default router