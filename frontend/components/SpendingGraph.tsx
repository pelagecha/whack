// frontend/components/SpendingGraph.tsx

"use client";

import React, { useState, useMemo } from "react";
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
    LineController,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import * as ss from "simple-statistics";

Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    LineController
);

interface IData {
    date: string;
    amount: number;
}

interface SpendingGraphProps {
    data: IData[];
}

const SpendingGraph: React.FC<SpendingGraphProps> = ({ data }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Define a threshold for unusual spending
    const threshold = useMemo(() => {
        const amounts = data.map((item) => item.amount);
        return ss.quantile(amounts, 0.9); // Top 10% as threshold
    }, [data]);

    // Calculate regression data
    const regressionData = useMemo(() => {
        if (data.length < 2) return [];
        // Convert dates to numerical values (e.g., days since start)
        const startDate = new Date(data[0].date);
        const xValues = data.map((item) =>
            Math.floor(
                (new Date(item.date).getTime() - startDate.getTime()) /
                    (1000 * 60 * 60 * 24)
            )
        );
        const yValues = data.map((item) => item.amount);
        const linearRegression = ss.linearRegression(
            xValues.map((x, i) => [x, yValues[i]])
        );
        const linearRegressionLine = ss.linearRegressionLine(linearRegression);
        return xValues.map((x) => linearRegressionLine(x));
    }, [data]);

    // Prepare data with indicator points and regression line
    const chartData = useMemo(() => {
        return {
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
                        (item) =>
                            item.amount > threshold ? "#ef4444" : "#3b82f6" // Red for high spending
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
                    borderWidth: 2,
                },
                {
                    label: "Trend",
                    data: regressionData,
                    fill: false,
                    borderColor: "#10b981", // Green for trend line
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0, // Hide points for trend line
                },
            ],
        };
    }, [data, regressionData, threshold]);

    const options = useMemo(() => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "top" as const,
                    labels: {
                        font: {
                            size: 14,
                        },
                        color: "#374151", // Dark gray
                    },
                },
                title: {
                    display: true,
                    text: "Monthly Spending Overview",
                    font: {
                        size: 18,
                    },
                    color: "#374151",
                },
                tooltip: {
                    mode: "index" as const,
                    intersect: false,
                    backgroundColor: "#ffffff",
                    titleColor: "#374151",
                    bodyColor: "#374151",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
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
                        color: "#374151",
                    },
                    grid: {
                        display: false, // Hide vertical gridlines
                    },
                    ticks: {
                        color: "#374151",
                        maxRotation: 45,
                        minRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 10,
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
                        color: "#374151",
                    },
                    grid: {
                        color: "rgba(156, 163, 175, 0.2)", // Light gray gridlines
                        borderDash: [3, 3],
                    },
                    ticks: {
                        color: "#374151",
                        callback: (value: number) => `$${value}`,
                        beginAtZero: true,
                    },
                },
            },
        };
    }, []);

    return (
        <>
            {/* Graph Container */}
            <motion.div
                className={`relative bg-white shadow-lg rounded-lg cursor-pointer transition-all duration-300 overflow-hidden ${
                    isExpanded
                        ? "w-full h-full fixed top-0 left-0 z-50 p-6"
                        : "w-full h-80"
                }`}
                onClick={() => setIsExpanded(true)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
            >
                <div className="w-full h-full">
                    <Line data={chartData} options={options} />
                </div>

                {/* Close Button */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.button
                            className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold p-2 rounded-full shadow"
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsExpanded(false);
                            }}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            aria-label="Close Graph"
                        >
                            <FaTimes />
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
