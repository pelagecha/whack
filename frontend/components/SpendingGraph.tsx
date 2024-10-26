// frontend/components/SpendingGraph.tsx

"use client";

import React, { useState } from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";

// Register the necessary components
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface IData {
    date: string;
    amount: number;
}

interface ISpendingGraphProps {
    data: IData[];
}

const SpendingGraph: React.FC<ISpendingGraphProps> = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Define a threshold for unusual spending
    const threshold = 200;

    // Prepare data with indicator points
    const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: "Spending",
                data: data.map((item) => item.amount),
                fill: true,
                backgroundColor: "rgba(59, 130, 246, 0.1)", // Light blue fill
                borderColor: "rgba(59, 130, 246, 1)", // Blue border
                tension: 0.4, // Smooth curves
                pointRadius: data.map((item) =>
                    item.amount > threshold ? 6 : 3
                ),
                pointBackgroundColor: data.map(
                    (item) => (item.amount > threshold ? "#ef4444" : "#3b82f6") // Red for high spending
                ),
                pointBorderColor: data.map((item) =>
                    item.amount > threshold ? "#f87171" : "#60a5fa"
                ),
                pointHoverRadius: data.map((item) =>
                    item.amount > threshold ? 8 : 5
                ),
                pointHoverBackgroundColor: data.map((item) =>
                    item.amount > threshold ? "#dc2626" : "#2563eb"
                ),
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
                labels: {
                    font: {
                        size: 14,
                    },
                },
            },
            title: {
                display: true,
                text: "Monthly Spending Overview",
                font: {
                    size: 18,
                },
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        const label = context.dataset.label || "";
                        const value = context.parsed.y || 0;
                        return `${label}: $${value.toFixed(2)}`;
                    },
                },
            },
        },
        interaction: {
            mode: "nearest" as const,
            axis: "x" as const,
            intersect: false,
        },
        scales: {
            x: {
                display: true,
                title: {
                    display: true,
                    text: "Date",
                    font: {
                        size: 16,
                    },
                },
                grid: {
                    display: false,
                },
            },
            y: {
                display: true,
                title: {
                    display: true,
                    text: "Amount ($)",
                    font: {
                        size: 16,
                    },
                },
                grid: {
                    color: "rgba(75, 192, 192, 0.2)",
                },
                ticks: {
                    callback: (value: number) => `$${value}`,
                },
            },
        },
    };

    return (
        <>
            {/* Graph Container */}
            <motion.div
                className={`relative bg-white shadow-lg rounded-lg cursor-pointer transition-all duration-300 ${
                    isExpanded
                        ? "w-full h-full fixed top-0 left-0 z-50 p-6"
                        : "w-full h-80"
                }`}
                onClick={() => setIsExpanded(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <Line data={chartData} options={options} />

                {/* Close Button */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.button
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-full"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(false);
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                        >
                            &times;
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Overlay for Expanded View */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setIsExpanded(false)}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default SpendingGraph;
