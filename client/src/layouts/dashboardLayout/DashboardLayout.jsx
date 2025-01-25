import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { Auth } from "../../config/firebase.config";
import { useEffect, useState } from "react";
import ChatList from "../../components/chatList/ChatList";
import DashboardPage from "../../routes/dashboardPage/DashboardPage";

const DashboardLayout = ({ isChatListVisible, toggleChatList }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = Auth.onAuthStateChanged(user => {
            if (!user) {
                navigate("/sign-in");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    return (
        <div className={`dashboardLayout font-gilroy ${isChatListVisible ? "chat-list-open" : "chat-list-closed"}`}>
            <div className="menu">
                <ChatList
                    isChatListVisible={isChatListVisible}
                    toggleChatList={toggleChatList}
                />
            </div>
            <div className="content">
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;