import express from "express";
import { signupUser, loginUser, logoutUser, followUser, updateUser, getUserProfile, getSuggestedUser } from "../controllers/userController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", signupUser);
router.get("/suggested",protectRoute, getSuggestedUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUser);
router.put("/update/:id", protectRoute, updateUser);
router.get("/profile/:query", getUserProfile); //get user by id or username


export default router;