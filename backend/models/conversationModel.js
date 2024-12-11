import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      text: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      img: {type: Boolean, default: false},
      seen: {type: Boolean, default: false},
    },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
