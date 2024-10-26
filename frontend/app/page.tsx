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
            const parsedData = rows.map((row) => {
                const [id, date, category, amount] = row.split(",");
                return { id, date, category, amount: parseFloat(amount) };
            });
            setData([...parsedData]);
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen p-8 flex flex-col justify-between">
            <div>
                <h1 className="text-4xl font-bold mb-8">Finance Tracker</h1>
                {data.length > 0 ? (
                    <>
                        <DataTable data={data} />
                        <SpendingGraph data={data} />
                    </>
                ) : (
                    <p className="text-lg mb-8">
                        No previous data, use the upload form below...
                    </p>
                )}
            </div>
            <FileUpload onFileUpload={handleFileUpload} />
        </div>
    );
}
