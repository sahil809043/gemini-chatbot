import Chat from "../models/chats.js";
import UserChats from "../models/userChats.js";
import mongoose from "mongoose";

const getUserChats = async (req, res) => {
    const userId = req.auth.uid;

    try {
        const userChats = await UserChats.find({ userId });
        if (!userChats.length) return res.status(215).send({ message: 'no chat found' });
        res.status(200).send(userChats[0].chats);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Error fetching userchats!" });
    }
};

const createNewChat = async (req, res) => {
    const userId = req.auth.uid;
    const { text } = req.body;

    try {
        const newChat = new Chat({
            userId: userId,
            history: [{ role: "user", parts: [{ text }] }],
        });

        const savedChat = await newChat.save();
        const userChats = await UserChats.find({ userId: userId });

        if (!userChats.length) {
            const newUserChats = new UserChats({
                userId: userId,
                chats: [
                    {
                        _id: savedChat._id,
                        title: text.substring(0, 40),
                    },
                ],
            });

            await newUserChats.save();
        } else {
            await UserChats.updateOne(
                { userId: userId },
                {
                    $push: {
                        chats: {
                            _id: savedChat._id,
                            title: text.substring(0, 40),
                        },
                    },
                }
            );
        }
        res.status(201).send(newChat._id);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error creating chat!");
    }
}

const getUserChat = async (req, res) => {
    const userId = req.auth.uid;
    const chatId = req.params.id;


    if (!chatId) {
        return res.status(400).json({ message: "Chat ID is required." });
    }

    if (!mongoose.Types.ObjectId.isValid(chatId)) {
        return res.status(400).json({ message: "Invalid Chat ID format." });
    }

    try {
        const chat = await Chat.findOne({ _id: chatId, userId });

        if (!chat) {
            return res.status(404).json({ message: "Chat not found." });
        }

        return res.status(200).json(chat);
    } catch (err) {
        console.error("Error fetching chat:", err.message);
        return res.status(500).json({ message: "Error fetching chat! Please try again later." });
    }
};

const updateChat = async (req, res) => {
    const userId = req.auth.uid;
    const chatId = req.params.id;

    const { question, answer, img } = req.body;

    const newItems = [
        ...(question
            ? [{ role: "user", parts: [{ text: question }], ...(img && { img }) }]
            : []),
        { role: "model", parts: [{ text: answer }] },
    ];

    try {
        const updatedChat = await Chat.updateOne(
            { _id: chatId, userId },
            {
                $push: {
                    history: {
                        $each: newItems,
                    },
                },
            }
        );
        res.status(200).send(updatedChat);
    } catch (err) {
        console.log(err);
        res.status(500).send("Error adding conversation!");
    }
}


export { getUserChats, createNewChat, getUserChat, updateChat };