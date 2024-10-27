// HomePage.tsx
"use client";

import { useState, useEffect } from "react";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";
import TimeRangeSelector from "./TimeRangeSelector";
import Header from "../components/Header";
import InfoTiles from "../components/InfoTiles";

// Define the Transaction and CategoryData interfaces
interface Transaction {
    id: string;
    date: string;
    time: string;
    category: string;
    amount: number;
    reference: string;
}
// acc_num, date, time, category, amount, reference;

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

    // Fetch data from the backend API when the component mounts
    // Fetch data from the backend API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/home");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonData: Transaction[] = await response.json();
                console.log("Fetched data:", jsonData); // Debug: Log fetched data
                setData(jsonData);
                setFilteredData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Process data to calculate categories, balance, and total spending
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

    // Calculate spending increase
    useEffect(() => {
        if (filteredData.length > 0) {
            const halfIndex = Math.floor(filteredData.length / 2);
            const firstHalf = filteredData.slice(0, halfIndex);
            const secondHalf = filteredData.slice(halfIndex);

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

    // Handle category filter changes
    const handleFilterChange = (selectedCategories: string[]) => {
        const updatedData = data.filter((transaction) =>
            selectedCategories.includes(transaction.category)
        );
        setFilteredData(updatedData);
    };

    // Handle time range changes
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
            <Header />

            <main className="flex-grow container mx-auto p-8">
                <InfoTiles
                    balance={balance}
                    totalSpending={totalSpending}
                    spendingIncrease={spendingIncrease}
                    transactionCount={data ? data.length : 0}
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
                            No transactions available.
                        </p>
                    </div>
                )}
            </main>

            <footer className="bg-gray-900 text-white p-4 text-center">
                <p>&copy; 2024 Clean my Credit. All rights reserved.</p>
            </footer>
        </div>
    );
}
