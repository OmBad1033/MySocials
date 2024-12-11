import express from "express";
import { createPost, getPost, deletePost, likePost, replyPost, getFeedPosts, getUserPosts } from "../controllers/postController.js";
import protectRoute from "../middleware/protectRoute.js";


const router = express.Router();
router.get("/feed",protectRoute, getFeedPosts);
router.get("/:id", getPost);
router.get("/user/:username", getUserPosts);
router.post("/create",protectRoute, createPost);
router.delete("/delete/:id",protectRoute, deletePost);
router.put("/reply/:id",protectRoute, replyPost);
router.put("/like/:id",protectRoute, likePost);

export default router;