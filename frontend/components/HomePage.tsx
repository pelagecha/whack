// frontend/pages/index.tsx

"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";

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

    useEffect(() => {
        const categoryMap: { [key: string]: number } = {};
        data.forEach((transaction) => {
            if (
                transaction.category &&
                typeof transaction.amount === "number"
            ) {
                categoryMap[transaction.category] =
                    (categoryMap[transaction.category] || 0) +
                    transaction.amount;
            }
        });
        const categories = Object.keys(categoryMap).map((cat) => ({
            category: cat,
            amount: categoryMap[cat],
        }));
        setCategoriesData(categories);
    }, [data]);

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

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Ccredit</h1>
                    {/* Optional: Add Navigation Links Here */}
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-6">
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Spending Lens Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <SpendingLens
                                categories={categoriesData}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        {/* Spending Graph Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <SpendingGraph data={filteredData} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-lg mb-8">
                            No data available. Please upload your spending CSV
                            file below.
                        </p>
                        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
                            <FileUpload onFileUpload={handleFileUpload} />
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2024 Clean my Credit. All rights reserved.</p>
            </footer>
        </div>
    );
}
