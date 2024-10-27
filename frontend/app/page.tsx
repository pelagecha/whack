"use client";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import { DataProvider } from "../components/DataContext";
import HomePage from "../components/HomePage";
import Login from "../components/Login";
import Signup from "../components/Signup";

export default function Page() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <DataProvider>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Routes>
                </DataProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}
