import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { ChatContext } from '../../context/ChatContext'

const Sidebar = () => { 
    const { 
        getUsers, 
        users, 
        selectedUser, 
        setSelectedUser,
        unseenMessages, 
        setUnseenMessages
    } = useContext(ChatContext)

    const { logout, onlineUsers } = useContext(AuthContext)
    const navigate = useNavigate()
    const [input, setInput] = useState('')

    // Filter users based on input
    const filteredUsers = input ? 
        users.filter((user) => 
            user.fullName?.toLowerCase().includes(input.toLowerCase())
        ) : 
        users;

    // Fetch users when component mounts
    useEffect(() => {
        console.log("🔄 Sidebar: Fetching users...");
        getUsers();
    }, []); // ✅ Removed getUsers from dependencies (causes infinite loop)

    // Clear unseen messages when user is selected
    const handleUserClick = (user) => {
        console.log("👤 Selected user:", user._id);
        setSelectedUser(user);
        
        // Clear unseen count for this user
        if (unseenMessages[user._id] > 0) {
            setUnseenMessages(prev => {
                const updated = { ...prev };
                delete updated[user._id];
                return updated;
            });
        }
    };

    // Debug log for users
    useEffect(() => {
        console.log("📊 Sidebar users state:", users);
        console.log("📨 Unseen messages:", unseenMessages);
        console.log("🌐 Online users:", onlineUsers);
    }, [users, unseenMessages, onlineUsers]);

    return (
        <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-auto text-white ${selectedUser ? "max-md:hidden" : ""}`}>
            <div className='pb-5'>
                <div className='flex justify-between items-center'>
                    <img src={assets.logo} alt="logo" className='max-w-40'/>
                    <div className='relative py-2 group'>
                        <img src={assets.menu_icon} alt="menu" className='max-h-5 cursor-pointer'/>
                        <div className='absolute top-full right-0 z-20 w-32 p-3 rounded-md
                            bg-[#232142] border border-gray-600 text-gray-100 hidden
                            group-hover:block'>
                            <p 
                                onClick={() => navigate('/profile')} 
                                className='cursor-pointer text-sm hover:text-white mb-2'
                            >
                                Edit Profile
                            </p> 
                            <hr className='my-2 border-t border-gray-500'/>
                            <p 
                                onClick={async () => {
                                    await logout();
                                    navigate('/login');
                                }}
                                className='cursor-pointer text-sm hover:text-white'
                            >
                                Logout
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className='bg-[#282143] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
                    <img src={assets.search_icon} alt="search" className='w-3' />
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className='bg-transparent border-none outline-none
                            text-white text-xs placeholder-[#c8c8c8] flex-1 w-full' 
                        placeholder='Search User....'
                    />
                </div>
            </div>
            
            {/* User List */}
            <div className='flex flex-col gap-1'>
                {filteredUsers.length === 0 ? (
                    <div className="text-center text-gray-400 py-4">
                        {users.length === 0 ? "No users found" : "No users match your search"}
                    </div>
                ) : (
                    filteredUsers.map((user) => (
                        <div 
                            key={user._id}
                            onClick={() => handleUserClick(user)}
                            className={`relative flex items-center gap-3 p-2 pl-4 rounded cursor-pointer 
                                max-sm:text-sm hover:bg-[#282142]/30 transition-colors duration-200
                                ${selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''}`}
                        >
                            <div className='relative'>
                                <img 
                                    src={user?.profilePic || assets.avatar_icon} 
                                    alt={user.fullName} 
                                    className='w-[35px] aspect-square rounded-full object-cover'
                                />
                                {/* Online indicator dot */}
                                {user._id && onlineUsers.includes(user._id) && (
                                    <div className='absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white'></div>
                                )}
                            </div>
                            <div className='flex flex-col leading-5 flex-1 min-w-0'>
                                <p className='font-medium truncate'>{user.fullName}</p>
                                {user._id && onlineUsers.includes(user._id) ? (
                                    <span className='text-green-400 text-xs'>Online</span>
                                ) : (
                                    <span className='text-neutral-400 text-xs'>Offline</span>
                                )}
                            </div>
                            
                            {/* Unseen messages badge */}
                            {unseenMessages[user._id] > 0 && (
                                <div className='absolute right-3'>
                                    <span className='text-xs h-5 w-5 flex justify-center items-center 
                                        rounded-full bg-violet-600 text-white'>
                                        {unseenMessages[user._id] > 9 ? '9+' : unseenMessages[user._id]}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
} 

export default Sidebar