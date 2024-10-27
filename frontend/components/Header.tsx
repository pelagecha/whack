import React from "react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
    user: { username: string } | null;
    onRegister: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRegister }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/login");
    };

    return (
        <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-4xl font-extrabold tracking-tight">
                    Capital
                </h1>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <p className="text-lg font-medium">
                            Welcome,{" "}
                            <span className="font-semibold">
                                {user.username}
                            </span>
                        </p>
                    ) : (
                        <div className="space-x-3">
                            <button
                                onClick={() => navigate("/signup")}
                                className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
                            >
                                Signup
                            </button>
                            <button
                                onClick={handleLogin}
                                className="px-4 py-2 bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-800 transition duration-300"
                            >
                                Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
