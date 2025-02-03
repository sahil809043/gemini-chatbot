import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";

const DashboardPage = ({ isChatListVisible }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: async (text) => {
            return await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ text }),
            }).then((res) => res.json());
        },
        onSuccess: (id) => {
            queryClient.invalidateQueries({ queryKey: ["userChats"] });
            navigate(`/dashboard/chats/${id}`);
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = e.target.text.value;
        if (!text) return;

        mutation.mutate(text);
    };
    return (
        <div className={`dashboardPage font-ultra tracking-tighter ${isChatListVisible ? "reduced" : "expanded"}`}>
            <div className="texts">
                <div className="logo flex flex-col items-center">
                    <img src="/logo.png" alt="" className="mx-auto" />
                    <h1 className="font-gilroy">GeminiX</h1>
                </div>
                <div className="options">
                    <div className="option transition-all duration-700 ease-in-out transform hover:scale-105 text-nowrap cursor-pointer flex flex-col items-center">
                        <img src="/chat.png" alt="" className="mx-auto" />
                        <span>Create a New Chat</span>
                    </div>
                    <div className="option transition-all duration-700 ease-in-out transform hover:scale-105 text-nowrap cursor-pointer flex flex-col items-center">
                        <img src="/image.png" alt="" className="mx-auto" />
                        <span>Analyze Images</span>
                    </div>
                    <div className="option transition-all duration-700 ease-in-out transform hover:scale-105 text-nowrap cursor-pointer flex flex-col items-center">
                        <img src="/code.png" alt="" className="mx-auto" />
                        <span>Help me with my Code</span>
                    </div>
                </div>
            </div>
            <div className="formContainer">
                <form onSubmit={handleSubmit} className="flex items-center justify-center">
                    <input
                        type="text"
                        name="text"
                        placeholder="Ask me anything..."
                        className="border rounded-l-lg px-4 py-2 flex-grow"
                    />
                    <button className="bg-blue-500 text-white rounded-r-lg px-4 py-2">
                        <img src="/arrow.png" alt="" className="mx-auto" />
                    </button>
                </form>
            </div>
        </div>

    );
};

export default DashboardPage;