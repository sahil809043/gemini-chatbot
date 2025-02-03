import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ArrowLeftFromLineIcon, ArrowRightFromLineIcon } from "lucide-react"

const ChatList = ({ isChatListVisible, toggleChatList }) => {
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [error, setError] = useState(false);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchUserChats = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(true);
                    throw new Error(errorData.message || "An error occurred.");
                }

                const fetchedData = await response.json();
                setData(fetchedData);
                setError(false);
            } catch (error) {
                console.error("Error fetching user chats:", error.message);
                setError(true);
            }
        };

        fetchUserChats();
    }, []);

    const chatList = Array.isArray(data) ? data : [];

    return (
        <div className={`chatList ${isChatListVisible ? "visible" : ""}`}>
            <button className="chatListToggle" onClick={toggleChatList}>
                {isChatListVisible ? <ArrowLeftFromLineIcon /> : <ArrowRightFromLineIcon />}
            </button>

            <span className="title">DASHBOARD</span>
            <Link to="/dashboard">Create a new Chat</Link>
            <Link to="/">Explore GeminiX</Link>
            <Link to="/">Contact</Link>

            <hr />

            <span className="title">RECENT CHATS</span>
            <div className="list">
                {error
                    ? "Something went wrong!"
                    : chatList.map((chat) => (
                        <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                            {chat.title}
                        </Link>
                    ))}
            </div>

            <hr />
        </div>
    );
};

export default ChatList;
