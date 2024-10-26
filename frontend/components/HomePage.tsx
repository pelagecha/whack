// frontend/pages/index.tsx

"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";
import TimeRangeSelector from "./TimeRangeSelector";

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

        // Assuming balance calculation based on transactions
        const income = data
            .filter((transaction) => transaction.amount > 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        const expenses = data
            .filter((transaction) => transaction.amount < 0)
            .reduce((acc, transaction) => acc + transaction.amount, 0);
        setBalance(income + expenses);
    }, [data]);

    useEffect(() => {
        // Calculate spending increase (This is a placeholder logic)
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
            setFilteredData(parsedData); // Initialize filteredData with all data
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

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-4xl font-extrabold">Capital</h1>
                    {/* Optional: Add Navigation Links Here */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-8">
                {/* Dashboard Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-700">
                            Current Balance
                        </h2>
                        <p className="text-3xl text-green-600 font-extrabold mt-4">
                            ${balance.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-700">
                            Total Spending
                        </h2>
                        <p className="text-3xl text-red-600 font-extrabold mt-4">
                            ${totalSpending.toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-700">
                            Spending Increase
                        </h2>
                        <p className="text-3xl text-yellow-500 font-extrabold mt-4">
                            {spendingIncrease.toFixed(2)}%
                        </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                        <h2 className="text-2xl font-bold text-gray-700">
                            Transactions Count
                        </h2>
                        <p className="text-3xl text-blue-600 font-extrabold mt-4">
                            {data.length}
                        </p>
                    </div>
                </div>

                {/* Time Range Selector */}
                <div className="mb-8">
                    <TimeRangeSelector
                        onTimeRangeChange={handleTimeRangeChange}
                    />
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Spending Lens Card */}
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SpendingLens
                                categories={categoriesData}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        {/* Spending Graph Card */}
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

            {/* Footer */}
            <footer className="bg-gray-900 text-white p-4 text-center">
                <p>&copy; 2024 Clean my Credit. All rights reserved.</p>
            </footer>
        </div>
    );
}
