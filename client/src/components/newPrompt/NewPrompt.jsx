import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState(null);
    const [loading, setLoading] = useState(false);
    const [img, setImg] = useState({
        isLoading: false,
        error: "",
        dbData: {},
        aiData: {},
    });

    const chat = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "Initial user message" }],
            },
            ...(data?.history || []).map(({ role, parts }) => ({
                role,
                parts: [{ text: parts[0].text }],
            })),
        ],
    });

    const endRef = useRef(null);
    const formRef = useRef(null);
    const queryClient = useQueryClient();
    const hasRun = useRef(false);

    // Scroll to the latest message
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [data, question, answer, img.dbData]);

    // Mutation for updating chat on the server
    const mutation = useMutation({
        mutationFn: async (mutationData) => {
            const { question, answer, img } = mutationData;
            console.log(question, answer, img);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/api/chats/${data._id}`,
                {
                    method: "PUT",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        question: question || undefined,
                        answer: answer || undefined,
                        img: img?.filePath || undefined,
                    }),
                }
            );
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["chat", data._id]);
            formRef.current?.reset();
            setQuestion("");
            setAnswer("");
            setImg({
                isLoading: false,
                error: "",
                dbData: {},
                aiData: {},
            });
        },
        onError: (err) => {
            console.error("Failed to update chat:", err);
        },
    });

    // Send question to chat model  
    const add = async (text, isInitial = false) => {
        if (!text) alert("Please enter a question.");
        if (!isInitial) setQuestion(text);

        setAnswer(null);
        setLoading(true);

        try {
            const result = await chat.sendMessageStream(
                Object.keys(img.aiData).length ? [img.aiData, text] : [text]
            );

            let accumulatedText = "";
            for await (const chunk of result.stream) {
                accumulatedText += chunk.text();
            }

            setAnswer(accumulatedText);
            mutation.mutate({
                question: text,
                answer: accumulatedText,
                img: img.dbData,
            });
        } catch (err) {
            console.error("Error sending message:", err);
            setAnswer("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (text) add(text);
    };

    // Automatically send the first message if history length is 1
    useEffect(() => {
        if (!hasRun.current && data?.history?.length === 1) {
            add(data.history[0].parts[0].text, true);
        }
        hasRun.current = true;
    }, [data]);

    return (
        <>
            <div className="newPrompt font-gilroy">
                {img.isLoading && <div>Loading image...</div>}
                {loading && <div>Generating response...</div>}

                {img.dbData?.filePath && (
                    <IKImage
                        urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                        path={img.dbData.filePath}
                        width="380"
                        transformation={[{ width: 380 }]}
                    />
                )}

                {question && <div className="message user">{question}</div>}

                {/* Show AI answer */}
                {!loading && answer && (
                    <div className="message">
                        <Markdown>{answer}</Markdown>
                    </div>
                )}

                <div className="endChat" ref={endRef}></div>

                <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
                    <Upload setImg={setImg} />
                    <input id="file" type="file" hidden />
                    <input type="text" name="text" placeholder="prompt..." />
                    <button type="submit">
                        <img src="/arrow.png" alt="Send" />
                    </button>
                </form>
            </div>
        </>

    );
};

export default NewPrompt;
