import express from "express"
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and http server 
const app = express();
const server = http.createServer(app);

// Initialize socket.io server with proper CORS
export const io = new Server(server, {
    cors: { 
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Store online users
export const userSocketMap = {}; // {userId: socketId}

// Socket.io connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected:", userId, "Socket ID:", socket.id);

    if(userId) {
        // Convert to string and store
        userSocketMap[userId.toString()] = socket.id;
        console.log("User socket map updated:", userSocketMap);
    }
    
    // Emit online users to all connected clients 
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User Disconnected:", userId, "Socket ID:", socket.id);
        
        // Find and remove user from map
        for(const uid in userSocketMap) {
            if(userSocketMap[uid] === socket.id) {
                delete userSocketMap[uid];
                break;
            }
        }
        
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

// Middleware setup 
app.use(express.json({ limit: "4mb" }));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));

// Routes Setup
app.use("/api/status", (req, res) => res.send("Server is Live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();
if(process.env.NODE_ENV !=="production"){
    const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on PORT: " + PORT));
}


//Export server for vercel
export default server;