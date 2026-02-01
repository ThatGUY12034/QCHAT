import React, { useContext, useEffect, useState } from 'react'  // ✅ Added useEffect import
import assets from '../assets/assets'  // ✅ Removed unused imagesDummyData
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/AuthContext'

const RightSidebar = () => {  // ✅ Removed empty props

    const { selectedUser, messages } = useContext(ChatContext)
    const { logout, onlineUsers } = useContext(AuthContext)
    const [msgImages, setMsgImages] = useState([])

    // Get all images from messages and set them to the state 
    useEffect(() => {
        // ✅ FIXED: setMsgeImages → setMsgImages (typo)
        setMsgImages(
            messages.filter(msg => msg.image).map(msg => msg.image)
        )
    }, [messages])

    return selectedUser ? (  // ✅ Changed && to ? for conditional rendering
        <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll h-full
            ${selectedUser ? "" : "max-md:hidden"}`}>  

            <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'> 
                <img 
                    src={selectedUser?.profilePic || assets.avatar_icon} 
                    alt={selectedUser?.fullName || "User"} 
                    className='w-20 aspect-square rounded-full object-cover'
                />
                <div className='px-10 text-xl font-medium mx-auto flex items-center gap-2 justify-center'>
                    {onlineUsers.includes(selectedUser._id) && (
                        <span className='w-2 h-2 rounded-full bg-green-500'></span>
                    )}
                    <h1>{selectedUser.fullName}</h1>
                </div>
                <p className='px-10 mx-auto text-center'>{selectedUser.bio || "No bio yet"}</p>
            </div>
            
            <hr className='border-[#ffffff50] my-4'/>

            {/* Media Section */}
            <div className='px-5 text-xs'>
                <p className='font-medium mb-2'>Media</p>
                <div className='mt-2 max-h-[200px] overflow-y-auto grid grid-cols-2 gap-2 opacity-80'>
                    {msgImages.length > 0 ? (
                        msgImages.map((url, index) => (
                            <div 
                                key={index} 
                                onClick={() => window.open(url, '_blank')} 
                                className='cursor-pointer rounded overflow-hidden'
                            >
                                <img 
                                    src={url} 
                                    alt={`Shared ${index + 1}`} 
                                    className='w-full h-24 object-cover rounded-md hover:opacity-80 transition-opacity'
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-gray-400 py-4">
                            No media shared yet
                        </div>
                    )}
                </div>
            </div>

            {/* Logout Button */}
            <button 
                onClick={() => logout()}
                className='absolute bottom-5 left-1/2 transform -translate-x-1/2
                bg-gradient-to-r from-purple-400 to-violet-600 text-white border-none 
                text-sm font-medium py-2 px-8 rounded-full cursor-pointer hover:opacity-90 
                transition-opacity'
            >
                Logout
            </button>
        </div>
    ) : (
        <div className='bg-[#8185B2]/10 text-white w-full h-full flex items-center justify-center'>
            <div className='text-center text-gray-400'>
                <img src={assets.logo_icon} alt="Logo" className='w-16 mx-auto mb-2 opacity-50' />
                <p>Select a chat to view details</p>
            </div>
        </div>
    )
}

export default RightSidebar