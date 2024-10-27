"use client";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../components/DataContext";
import HomePage from "../components/HomePage";
import Login from "../components/Login";

export default function Page() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        {/* Add other routes here */}
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
