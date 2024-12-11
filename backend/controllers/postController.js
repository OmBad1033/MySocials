import User from "../models/userModel.js";
import Post from "../models/postModel.js";
import {v2 as cloudinary} from "cloudinary";


const createPost = async (req, res) => {
    try {
        console.log("here");
        const {postedBy, text} = req.body
        let img = req.body.img;
        if (!postedBy || !text) {
            return res.status(400).json({error: "Please fill all the fields"});
        }
        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        if(user._id.toString() != req.user._id.toString()) {
            return res.status(400).json({error: "You cannot post on your profile"});
        }

        const maxlenght = 500;
        if (text.length > maxlenght) {
            return res.status(400).json({error: "Text is too long"});
        }
        if (img) {
            //upload to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }
        //create post
        const newPost = new Post({
            postedBy,
            text,
            img
        });
        await newPost.save();
        res.status(200).json({message: "Post created successfully", newPost});

    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

const getPost = async (req, res) => {
    try {
        const {id }= req.params;
        console.log(id);
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

const deletePost = async (req, res) => {
    try {
        const {id} = req.params;
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        if(post.postedBy.toString() != req.user._id.toString()) {
            return res.status(401).json({error: "Unauthorized"});
        }
        if (post.img) {
            const publicId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(publicId);
        }
        await Post.findByIdAndDelete(id);
        res.status(200).json({message: "Post deleted successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}   

const likePost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const userId = req.user._id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        if(post.likes.includes(userId)) {
            //unlike
            await Post.updateOne({_id:postId}, {$pull: {likes: userId}});
            return res.status(200).json({message: "Post unliked successfully"});
        }
        //unlike
        post.likes.push(req.user._id);
        await post.save();
        res.status(200).json({message: "Post liked successfully"});
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

const replyPost = async (req, res) => {
    try {
        const {id:postId} = req.params;
        const {text} = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({error: "Post not found"});
        }
        if (!text) {
            return res.status(400).json({error: "Please fill all the fields"});
        }
        const newReply = {
            userId:req.user._id,
            text,
            userProfilePic: req.user.profilePic,
            username: req.user.username
        }
        post.replies.push(newReply);
        await post.save();
        res.status(200).json(newReply);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

const getFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }
        const following = user.following;
        const posts = await Post.find({postedBy: {$in:following}}).sort({createdAt: -1}); // where Post.postedBy is in user.following
        res.status(200).json(posts);  
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

const getUserPosts = async (req, res) => {
    try {
        const {username} = req.params;
        const user = await User.findOne({username});
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({error: error.message});
        console.log(error);
    }
}

export { createPost, getPost, deletePost, likePost, replyPost, getFeedPosts, getUserPosts };