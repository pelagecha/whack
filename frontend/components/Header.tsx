import React from "react";

interface HeaderProps {
    user: { username: string } | null;
    onRegister: () => void;
    onLogin: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onRegister, onLogin }) => {
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
                                onClick={onRegister}
                                className="px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-100 transition duration-300"
                            >
                                Register
                            </button>
                            <button
                                onClick={onLogin}
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
