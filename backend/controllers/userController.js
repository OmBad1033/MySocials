import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/helpers/generateTokenAndSetCookie.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Post from "../models/postModel.js";

const signupUser = async (req, res) => {
    try{
        console.log(req.body);
        const { name, username, email, password } = req.body;
        console.log(name, username, email, password);
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ name, username, email, password: hashedPassword });
        await newUser.save();
        if (!newUser) {
            return res.status(500).json({ error: "Failed to create user" });
        }
        generateTokenAndSetCookie(newUser._id, res);
        res.status(201).json({ 
            message: "User created successfully",
             _id: newUser._id,
             name: newUser.name,
             username: newUser.username,
             email: newUser.email,
             bio: newUser.bio,
             profilePic: newUser.profilePic
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
    
}

const loginUser = async (req, res) => {
    try{
        const { username, password } = req.body;
        console.log(username, password);
        const user = await User.findOne({ username });
        console.log(user);
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({ 
            message: "User logged in successfully",
             _id: user._id,
             name: user.name,
             username: user.username,
             email: user.email,
             bio: user.bio,
             profilePic: user.profilePic
            });

    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const logoutUser = async (req, res) => {
    try{
        res.clearCookie("jwt","", {maxAge: 1});
        res.status(200).json({message: "User logged out successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const followUser = async (req, res) => {
    try{
        const { id } = req.params;
        const userToModidfy = await User.findById(id);
        const currentUser = await User.findById(req.user._id);
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }
        if (!userToModidfy || !currentUser) {
            return res.status(404).json({ error: "User not found, invalid user id" });
        }
        const following = currentUser.following.includes(id);
        if (following) {
            //Unfollow User
            await User.findByIdAndUpdate(req.user._id, {$pull: { following: id }});
            await User.findByIdAndUpdate(id, {$pull: { followers: req.user._id }});
            res.status(200).json({ message: "User unfollowed successfully" });

        } else{
            //follow user
            await User.findByIdAndUpdate(req.user._id, {$push: { following: id }});
            await User.findByIdAndUpdate(id, {$push: { followers: req.user._id }});
            res.status(200).json({ message: "User followed successfully" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const updateUser = async (req, res) => {
    try{
        const id  = req.user._id;
        const { name, username, email, password, bio } = req.body;
        let profilePic = req.body.profilePic;
        let user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (req.params.id != id.toString()) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if (profilePic) {
            if (user.profilePic) {
                const public_id = user.profilePic.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(public_id);
            }
            const uploadResponse = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadResponse.secure_url;
        }
        user.name = name || user.name;
        user.username = username || user.username;
        user.email = email || user.email;
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;
        user = await user.save();
        user.password = null;

        //find all the post that the user replied and update the username and profile pic of the user
        const userId = user._id;
        await Post.updateMany(
            {"replies.userId":userId},
            {
                $set: {
                    "replies.$[reply].username":user.username,
                    "replies.$[reply].userProfilePic":user.profilePic
                }
            },
            {arrayFilters:[{"reply.userId":userId}]}
        )
        if (!user) {
            return res.status(500).json({ error: "Failed to update user" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const getUserProfile = async (req, res) => {
    //get user by id or username
    const { query } = req.params;

    try{
        let user;
        //check is query is userId
        if (mongoose.Types.ObjectId.isValid(query)) {
            user = await User.findById(query).select("-password").select("-updatedAt");
        } else {
            user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
            
        }
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(user) ;
    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

const getSuggestedUser = async (req, res) => {
    try{
        //exclude the current user form the suggested users
        const userId = req.user._id;
        const usersFollowedByCurrentUser = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {
                $match: {
                    _id: {
                        $ne: userId
                    }
                }
            },
            {
                $sample: {
                    size: 10
                }
            }
        ])
        const filteredUsers = users.filter(user => !usersFollowedByCurrentUser.following.includes(user._id));
        const suggestedUsers = filteredUsers.slice(0, 5);
        suggestedUsers.forEach((user) => {
            user.password = null;
        })
        res.status(200).json(suggestedUsers);

    } catch (error) {
        console.log(error);
        res.status(500).json({error: error.message});
    }
}

export {signupUser, loginUser,logoutUser, followUser, updateUser, getUserProfile, getSuggestedUser}