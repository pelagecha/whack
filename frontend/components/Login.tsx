import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../services/authService"; // Import the login function

const Login: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState(""); // New state for success message

    const handleLogin = async () => {
        if (username === "" || password === "") {
            setError("Please fill in both fields.");
        } else {
            setError("");
            try {
                const result = await loginUser(username, password);
                if (result.success) {
                    setSuccessMessage("Login successful!");
                    // Redirect to the main page or trigger authentication here
                    console.log("Login successful", result.user);
                } else {
                    setError(result.message);
                }
            } catch (error) {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                    Login
                </h2>
                {error && (
                    <motion.div
                        className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {error}
                    </motion.div>
                )}
                {successMessage && (
                    <motion.div
                        className="bg-green-100 text-green-600 p-3 mb-4 rounded-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {successMessage}
                    </motion.div>
                )}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 text-black"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-md transition duration-300 ease-in-out"
                >
                    Login
                </button>
                <p className="text-gray-500 text-sm text-center mt-4">
                    Forgot your password?{" "}
                    <span className="text-blue-600 hover:underline cursor-pointer">
                        Reset here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
