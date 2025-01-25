import "./chatPage.css";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import React from "react";

const ChatPage = () => {
    const path = useLocation().pathname;
    const chatId = path.split("/").pop();

    const { isPending, error, data } = useQuery({
        queryKey: ["chat", chatId],
        queryFn: async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chats/${chatId}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    credentials: "include",
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`HTTP Error ${response.status}: ${text}`);
            }

            try {
                return await response.json();
            } catch (e) {
                throw new Error("Invalid JSON response.");
            }
        },

    });

    return (
        <>
            <div className="chatPage">
                <div className="wrapper">
                    <div className="chat">
                        {isPending
                            ? "Loading..."
                            : error
                                ? "Something went wrong!"
                                : data?.history?.length > 0
                                    ? data.history.map((message, i) => (
                                        <React.Fragment key={i}>
                                            {message.img && (
                                                <IKImage
                                                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                                                    path={message.img}
                                                    height="300"
                                                    width="400"
                                                    transformation={[{ height: 300, width: 400 }]}
                                                    loading="lazy"
                                                    lqip={{ active: true, quality: 20 }}
                                                />
                                            )}
                                            <div
                                                className={
                                                    message.role === "user" ? "message user" : "message"
                                                }
                                            >
                                                <Markdown>{message.parts[0].text}</Markdown>
                                            </div>
                                        </React.Fragment>
                                    ))
                                    : "No chat history found."}

                        {data && <NewPrompt data={data} />}
                    </div>
                </div>
            </div>
            <div>
                
            </div>
        </>
    );

};

export default ChatPage;