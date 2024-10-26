"use client";

import { useState, useEffect } from "react";
import FileUpload from "../components/FileUpload";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";

export default function HomePage() {
    const [data, setData] = useState<
        { id: string; date: string; category: string; amount: number }[]
    >([]);
    const [categoriesData, setCategoriesData] = useState<
        { category: string; amount: number }[]
    >([]);

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
        };
        reader.readAsText(file);
    };

    const handleFilterChange = (selectedCategories: string[]) => {
        const filteredData = data.filter((transaction) =>
            selectedCategories.includes(transaction.category)
        );
        setData(filteredData);
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-4xl font-bold">Finance Tracker</h1>
            </header>
            <main className="flex-grow p-8">
                {data.length > 0 ? (
                    <div className="space-y-8">
                        <SpendingLens
                            categories={categoriesData}
                            onFilterChange={handleFilterChange}
                        />
                        <SpendingGraph data={data} />
                    </div>
                ) : (
                    <p className="text-lg mb-8">
                        No previous data, use the upload form below...
                    </p>
                )}
                <FileUpload onFileUpload={handleFileUpload} />
            </main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2024 Finance Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
}
