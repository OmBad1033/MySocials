import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import path from "path";
import userRoutes from "./routes/userRoutes.js";
import userPosts from "./routes/userPosts.js";
import messageRoutes from "./routes/messageRoutes.js";
import {app, server} from "./socket/socket.js";

import cookieParser from "cookie-parser";
import {v2 as cloudinary} from "cloudinary";

dotenv.config();
connectDB();
const PORT = process.env.PORT || 5000; 
const __dirname = path.resolve();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({ limit: '50mb',extended: true }));
app.use(cookieParser());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", userPosts);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}


server.listen(PORT, () => console.log(`Server started on port ${PORT}`));