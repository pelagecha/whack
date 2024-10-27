import React, { useState } from "react";
import axios from "axios";

const ChatUI: React.FC = () => {
    const [messages, setMessages] = useState<
        { sender: string; text: string }[]
    >([]);
    const [input, setInput] = useState("");

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = { sender: "user", text: input };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        try {
            const response = await axios.post("http://127.0.0.1:5000/chat", {
                message: input,
            });
            const botMessage = { sender: "bot", text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setInput("");
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    return (
        <div className="chat-container bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto border border-gray-200">
            <div className="messages overflow-y-auto h-80 mb-4 space-y-2 pr-2 bg-gray-50 rounded-lg p-2">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`message-bubble ${
                            msg.sender === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-gray-800 mr-auto"
                        } p-3 rounded-lg max-w-xs w-fit shadow-sm`}
                    >
                        {msg.text}
                    </div>
                ))}
            </div>

            <div className="input-container flex items-center border-t border-gray-300 pt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type your message..."
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
