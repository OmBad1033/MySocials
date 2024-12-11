import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
import { v2 as cloudinary } from "cloudinary";

async function sendMessage(req, res) {
  try {
    const { recipientId, message, img } = req.body;
    console.log("XXXXXXXXXXXXXXXX");
    const senderId = req.user._id;
    let imgUrl = "";
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });
    if (!conversation) {
      console.log("conversation not found");
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          sender: senderId,
          text: message,
          img: false,
        },
      });
      await conversation.save();
    }

    if (img) {
      console.log("Uploading image");
      const uploadResponse = await cloudinary.uploader.upload(img);
      console.log(uploadResponse);
      imgUrl = uploadResponse.secure_url;
      console.log("OOOOOOOOOOOOOOOOOOOO");
      console.log(imgUrl);
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      img: imgUrl,
      text: message,
    });
    console.log(newMessage);
    await Promise.all([
      conversation.updateOne({
        lastMessage: { sender: senderId, text: message, img: imgUrl? true: false },
      }),
      newMessage.save(),
    ]);
    const recipientSocketId = getRecipientSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(200).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getMessages(req, res) {
  const { otherUserId } = req.params;
  console.log(req.user);
  const myId = req.user._id;
  try {
    const conversation = await Conversation.findOne({
      participants: { $all: [myId, otherUserId] },
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }
    const messages = await Message.find({
      conversationId: conversation._id,
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getConversations(req, res) {
  const userId = req.user._id;
  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).populate({
      path: "participants",
      select: "profilePic username",
    });
    //remove the user form participant list
    conversations.forEach((conversation) => {
      conversation.participants = conversation.participants.filter(
        (participant) => participant["_id"].toString() !== userId.toString()
      );
    });

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export { sendMessage, getMessages, getConversations };
