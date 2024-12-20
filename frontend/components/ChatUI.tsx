import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid"; // Install uuid for unique IDs

interface Message {
    id: string;
    sender: "user" | "bot";
    text: string;
}

const ChatUI: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [showBanner, setShowBanner] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null); // To store the interval ID

    // const scrollToBottom = () => {
    //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return; // Prevent sending if typing is in progress

        const userMessage: Message = {
            id: uuidv4(),
            sender: "user",
            text: input,
        };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        setShowBanner(false);
        setIsTyping(true);

        try {
            const response = await axios.post("http://127.0.0.1:5000/chat", {
                message: input,
            });

            const botMessage: Message = {
                id: uuidv4(),
                sender: "bot",
                text: "",
            };
            setMessages((prevMessages) => [...prevMessages, botMessage]);

            const botResponse: string = response.data.response;
            let index = -1;

            // Clear any existing interval
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }

            typingIntervalRef.current = setInterval(() => {
                index++;
                if (index < botResponse.length) {
                    setMessages((prevMessages) =>
                        prevMessages.map((msg) =>
                            msg.id === botMessage.id
                                ? {
                                      ...msg,
                                      text: msg.text + botResponse[index],
                                  }
                                : msg
                        )
                    );
                } else {
                    if (typingIntervalRef.current) {
                        clearInterval(typingIntervalRef.current);
                    }
                    typingIntervalRef.current = null;
                    setIsTyping(false);
                }
            }, 1);
        } catch (error) {
            console.error("Error sending message:", error);
            setIsTyping(false);
        }

        setInput("");
        // setUploadedImage(null); // Clear image after sending a message
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSend();
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setUploadedImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (typingIntervalRef.current) {
                clearInterval(typingIntervalRef.current);
            }
        };
    }, []);

    return (
        <div className="chat-container bg-white p-6 rounded-xl shadow-md max-w-lg mx-auto border border-gray-200">
            {showBanner && (
                <div className="banner bg-blue-100 text-blue-800 p-3 rounded-lg mb-4">
                    Welcome to the chat! Start by sending a message.
                </div>
            )}
            {isTyping && (
                <div className="typing-banner bg-green-100 text-green-800 p-2 rounded-lg mb-4">
                    Chatbot is typing...
                </div>
            )}
            <div className="messages overflow-y-auto h-80 mb-4 space-y-2 pr-2 bg-gray-50 rounded-lg p-2">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`message-bubble ${
                            msg.sender === "user"
                                ? "bg-blue-500 text-white ml-auto"
                                : "bg-gray-200 text-gray-800 mr-auto"
                        } p-3 rounded-lg max-w-xs w-fit shadow-sm`}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {uploadedImage && (
                <div className="uploaded-image-preview mb-4 flex items-center space-x-2">
                    <img
                        src={uploadedImage}
                        alt="Uploaded preview"
                        className="w-10 h-10 rounded shadow"
                    />
                    <span className="text-gray-500 text-sm">
                        Image attached
                    </span>
                </div>
            )}

            <div className="input-container flex items-center border-t border-gray-300 pt-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type your message..."
                    disabled={isTyping} // Disable input while typing
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className={`cursor-pointer p-2 ${
                        isTyping ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {uploadedImage ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 transition"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.172 7l-4 4m0 0l-4-4m4 4v12"
                            />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-500 hover:text-gray-700 transition"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 11l4 4 4-4m-4 4V7"
                            />
                        </svg>
                    )}
                </label>
                <button
                    onClick={handleSend}
                    disabled={isTyping} // Disable button while typing
                    className={`bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition ${
                        isTyping ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatUI;
