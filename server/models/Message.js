import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        default: ""
    },
    image: {  // ✅ ADDED: You're using image field in controller
        type: String,
        default: ""
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// ✅ FIXED: Create Message model (not User!)
const Message = mongoose.model("Message", messageSchema);

export default Message;  // ✅ Export the MODEL, not the schema