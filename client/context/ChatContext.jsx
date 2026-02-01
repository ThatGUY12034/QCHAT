import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // Fixed naming
    const [unseenMessages, setUnseenMessages] = useState({});

    const { socket, axios } = useContext(AuthContext);

    // Function to get all users for sidebar 
    const getUsers = async () => {
        try {
            const { data } = await axios.get('/api/messages/users');
            if (data.success) {
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages || {});
            }
        } catch (error) {
            toast.error(error.message);  // Fixed: error.message
        }
    }

    // Function to get messages for selected user
    const getMessages = async (userId) => {  // Added userId parameter
        try {
            const { data } = await axios.get(`/api/messages/${userId}`);
            if (data.success) {
                setMessages(data.messages || []);
            }
        } catch (error) {
            toast.error(error.message);  // Fixed: error.message
        }
    }

    // Function to send message to selected user 
    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(
                `/api/messages/send/${selectedUser._id}`,  // Fixed URL
                messageData
            );
            if (data.success) {
                setMessages((prevMessages) => [...prevMessages, data.newMessage]);
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error(error.message);  // Fixed: error.message
        }
    }

    // Function to subscribe to messages from selected user 
    const subscribeToMessages = () => {  // Removed async, not needed
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {  // Added parameter
            if (selectedUser && newMessage.senderId === selectedUser._id) {
                // Mark as seen and add to messages
                const messageWithSeen = { ...newMessage, seen: true };
                setMessages((prevMessages) => [...prevMessages, messageWithSeen]);
                
                // Mark as read on server
                axios.put(`/api/messages/mark/${newMessage._id}`).catch(console.error);
            } else {
                // Update unseen messages count
                setUnseenMessages((prevUnseenMessages) => ({
                    ...prevUnseenMessages,
                    [newMessage.senderId]: (prevUnseenMessages[newMessage.senderId] || 0) + 1
                }));
            }
        });
    }

    // Function to unsubscribe from messages 
    const unsubscribeFromMessages = () => {
        if (socket) {
            socket.off("newMessage");
        }
    }

    useEffect(() => {
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser]);

    // Fetch users when component mounts
    useEffect(() => {
        getUsers();
    }, []);

    // Fetch messages when selectedUser changes
    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
            // Clear unseen count for this user
            setUnseenMessages(prev => {
                const updated = { ...prev };
                delete updated[selectedUser._id];
                return updated;
            });
        }
    }, [selectedUser]);

    const value = {
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,  // Added to exports
        
        sendMessage,
        setSelectedUser,  // Fixed naming
        unseenMessages,
        setUnseenMessages
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};