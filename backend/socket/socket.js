import {Server} from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/messageModel.js";
import conversationModel from "../models/conversationModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const userSocketMap = {}; // userId: socketId

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    const userId = socket.handshake.query.userId;
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    socket.on("markMessageAsSeen", async({conversationId, userId, username}) => {
        try{
            await Message.updateMany(
                {conversationId: conversationId, seen: false},//filter
                {$set: {seen: true}//set
            });
            await conversationModel.updateOne(
                {_id: conversationId},
                {$set: {"lastMessage.seen": true}}
            )
            console.log("message marked as seen");
            console.log(getRecipientSocketId(userId), userId, username);
            if(getRecipientSocketId(userId)){
                io.to(getRecipientSocketId(userId)).emit("messagesSeen", conversationId);
            }

        } catch(err){
            console.log(err.message);
        }
    })

    io.emit("getOnlineUsers",Object.keys(userSocketMap));
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));

    })
});

export const getRecipientSocketId = (userId) => {
    return userSocketMap[userId];
};

export {app, server, io}