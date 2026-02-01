import React, { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets'
import { formatMessageTime } from '../lib/utils'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ChatContainer = () => {
    const { messages, selectedUser, setSelectedUser, sendMessage, getMessages } = useContext(ChatContext)
    const { authUser, onlineUsers } = useContext(AuthContext)  // ✅ FIXED: "onineUsers" → "onlineUsers"

    const scrollEnd = useRef()
    const [input, setInput] = useState('');

    // Handle sending a message 
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;
        await sendMessage({ text: input.trim() });
        setInput("");
    }

    // Handle sending an image
    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select an image file");
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    }

    useEffect(() => {
        if (selectedUser) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser, getMessages]);

    useEffect(() => {
        if (scrollEnd.current && messages) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>
            {/*------------Header------------------*/}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img 
                    src={selectedUser.profilePic || assets.avatar_icon} 
                    alt={selectedUser.fullName} 
                    className='w-8 rounded-full'
                />
                <div className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUsers.includes(selectedUser._id) && (  // ✅ FIXED: Added conditional rendering
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    )}
                </div>
                <img 
                    onClick={() => setSelectedUser(null)} 
                    src={assets.arrow_icon} 
                    alt="Back" 
                    className='md:hidden max-w-7 cursor-pointer' 
                />
                <img src={assets.help_icon} alt="Help" className='max-md:hidden max-w-5' />
            </div>
            
            {/*---------------CHAT AREA-------------------- */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 py-8">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <div 
                            key={msg._id || index}  // ✅ FIXED: Use msg._id if available
                            className={`flex items-end gap-2 ${msg.senderId === authUser._id ? 'justify-end' : 'justify-start'}`}
                        >
                            {/* Avatar */}
                            <div className='text-center text-xs'>
                                <img 
                                    src={msg.senderId === authUser._id
                                        ? authUser?.profilePic || assets.avatar_icon 
                                        : selectedUser?.profilePic || assets.avatar_icon
                                    } 
                                    alt="Avatar"  
                                    className='w-7 rounded-full'
                                />
                                <p className='text-gray-500'>
                                    {formatMessageTime(msg.createdAt)}
                                </p>
                            </div>
                            
                            {/* Message Content */}
                            <div>
                                {msg.image ? (
                                    <img 
                                        src={msg.image} 
                                        alt="Shared" 
                                        className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' 
                                    />
                                ) : (
                                    <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all text-white
                                        ${msg.senderId === authUser._id 
                                            ? 'bg-violet-500/30 rounded-br-none' 
                                            : 'bg-gray-700/30 rounded-bl-none'
                                        }`}
                                    >
                                        {msg.text}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
                <div ref={scrollEnd} />
            </div>
            
            {/*-----------------Bottom Area------------------ */}
            <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input 
                        onChange={(e) => setInput(e.target.value)} 
                        value={input} 
                        onKeyDown={(e) => e.key === "Enter" ? handleSendMessage(e) : ""}
                        type="text"  
                        placeholder='Send a message' 
                        className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
                    />
                    <input 
                        onChange={handleSendImage}
                        type="file" 
                        id='image' 
                        accept='image/png, image/jpeg, image/jpg' 
                        hidden 
                    />
                    <label htmlFor="image">
                        <img 
                            src={assets.gallery_icon} 
                            alt="Attach image" 
                            className='w-5 mr-2 cursor-pointer'
                        />
                    </label>
                </div>
                <img 
                    onClick={handleSendMessage}
                    src={assets.send_button} 
                    alt="Send" 
                    className='w-7 cursor-pointer'
                />
            </div>
        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden h-full'>
            <img src={assets.logo_icon} alt="Logo" className='max-w-16' />
            <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
        </div>
    )
}

export default ChatContainer