"use client";

import { useState } from "react";
import FileUpload from "../components/FileUpload";
import DataTable from "../components/DataTable";
import SpendingGraph from "../components/SpendingGraph";

export default function Home() {
    const [data, setData] = useState<
        { id: string; date: string; category: string; amount: number }[]
    >([]);

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
                        // Skip invalid rows
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

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-blue-600 text-white p-4">
                <h1 className="text-4xl font-bold">Finance Tracker</h1>
            </header>
            <main className="flex-grow p-8">
                {data.length > 0 ? (
                    <div className="space-y-8">
                        <DataTable data={data} />
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
