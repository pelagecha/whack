"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";
import TimeRangeSelector from "./TimeRangeSelector";
import { registerUser, loginUser } from "../services/authService";
import Header from "../components/Header";
import InfoTiles from "../components/InfoTiles";
import axios from "axios";
interface Transaction {
    id: string;
    date: string;
    category: string;
    amount: number;
}

interface CategoryData {
    category: string;
    amount: number;
}

export default function HomePage() {
    const [data, setData] = useState<Transaction[]>([]);
    const [categoriesData, setCategoriesData] = useState<CategoryData[]>([]);
    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [totalSpending, setTotalSpending] = useState<number>(0);
    const [spendingIncrease, setSpendingIncrease] = useState<number>(0);
    const [user, setUser] = useState<unknown>(null);

    useEffect(() => {
        const categoryMap: { [key: string]: number } = {};
        let totalSpent = 0;

        data.forEach((transaction) => {
            if (
                transaction.category &&
                typeof transaction.amount === "number"
            ) {
                categoryMap[transaction.category] =
                    (categoryMap[transaction.category] || 0) +
                    transaction.amount;
                totalSpent += transaction.amount;
            }
        });

        const categories = Object.keys(categoryMap).map((cat) => ({
            category: cat,
            amount: categoryMap[cat],
        }));

        setCategoriesData(categories);
        setTotalSpending(totalSpent);

        const income = data
            .filter((transaction) => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const expenses = data
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        setBalance(income + expenses);
    }, [data]);

    useEffect(() => {
        if (filteredData.length > 0) {
            const firstHalf = filteredData.slice(
                0,
                Math.floor(filteredData.length / 2)
            );
            const secondHalf = filteredData.slice(
                Math.floor(filteredData.length / 2)
            );

            const firstHalfSpending = firstHalf.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
            );
            const secondHalfSpending = secondHalf.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
            );

            if (firstHalfSpending > 0) {
                setSpendingIncrease(
                    ((secondHalfSpending - firstHalfSpending) /
                        firstHalfSpending) *
                        100
                );
            }
        }
    }, [filteredData]);

    const handleFileUpload = (file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const rows = text.split("\n").slice(1);
            const parsedData = rows
                .map((row) => {
                    const [id, date, category, amount] = row.split(",");
                    const parsedAmount = parseFloat(amount);
                    if (!id || !date || !category || isNaN(parsedAmount)) {
                        return null;
                    }
                    return { id, date, category, amount: parsedAmount };
                })
                .filter(
                    (
                        entry
                    ): entry is {
                        id: string;
                        date: string;
                        category: string;
                        amount: number;
                    } => entry !== null
                );
            setData(parsedData);
            setFilteredData(parsedData);
        };
        reader.readAsText(file);
    };

    const handleFilterChange = (selectedCategories: string[]) => {
        const updatedData = data.filter((transaction) =>
            selectedCategories.includes(transaction.category)
        );
        setFilteredData(updatedData);
    };

    const handleTimeRangeChange = (startDate: string, endDate: string) => {
        const updatedData = data.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return (
                transactionDate >= new Date(startDate) &&
                transactionDate <= new Date(endDate)
            );
        });
        setFilteredData(updatedData);
    };

    const handleRegister = async (username: string, password: string) => {
        const response = await registerUser(username, password);
        if (response.success) {
            alert("Registration successful. Please log in.");
        } else {
            alert("Registration failed: " + response.message);
        }
    };

    const handleLogin = async (username: string, password: string) => {
        const response = await loginUser(username, password);
        if (response.success) {
            setUser(response.user);
            setData(response.user.transactions || []);
            setFilteredData(response.user.transactions || []);
        } else {
            alert("Login failed: " + response.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header
                user={user}
                onRegister={() => handleRegister("testUser", "password123")}
                onLogin={() => handleLogin("testUser", "password123")}
            />

            <main className="flex-grow container mx-auto p-8">
                <InfoTiles
                    balance={balance}
                    totalSpending={totalSpending}
                    spendingIncrease={spendingIncrease}
                    transactionCount={data ? data.length : 0} // Add null/undefined check
                />

                <div className="mb-8">
                    <TimeRangeSelector onChange={handleTimeRangeChange} />
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SpendingLens
                                categories={categoriesData}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SpendingGraph data={filteredData} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-xl mb-8 text-gray-700">
                            No data available. Please upload your spending CSV
                            file below.
                        </p>
                        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
                            <FileUpload onFileUpload={handleFileUpload} />
                        </div>
                    </div>
                )}
            </main>

            <footer className="bg-gray-900 text-white p-4 text-center">
                <p>&copy; 2024 Clean my Credit. All rights reserved.</p>
            </footer>
        </div>
    );
}
