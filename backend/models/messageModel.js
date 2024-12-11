import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: {type:mongoose.Schema.Types.ObjectId, ref:'Conversation'},
    sender: {type:mongoose.Schema.Types.ObjectId, ref:'User'},
    text: {type: String},
    seen: {type: Boolean, default: false},
    img:{
        type: String,
        default: null,
    }
},{timestamps: true});

export default mongoose.model("Message", messageSchema)