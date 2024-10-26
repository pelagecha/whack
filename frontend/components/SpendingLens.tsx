// frontend/components/SpendingLens.tsx

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";

interface ICategoryData {
    category: string;
    amount: number;
}

interface ISpendingLensProps {
    categories: ICategoryData[];
    onFilterChange: (categories: string[]) => void;
}

const SpendingLens: React.FC<ISpendingLensProps> = ({
    categories,
    onFilterChange,
}) => {
    // Initialize selectedCategories with valid categories
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categories
            ?.filter((cat) => cat && cat.category)
            .map((cat) => cat.category) || []
    );

    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Filter out invalid categories
    const validCategories =
        categories?.filter(
            (cat) => cat && typeof cat.amount === "number" && !isNaN(cat.amount)
        ) || [];

    // Calculate total spending to determine proportions
    const totalSpending = validCategories.reduce(
        (total, cat) => total + cat.amount,
        0
    );

    // Define a threshold for unusual spending (e.g., top 10% spenders)
    const thresholdAmount =
        validCategories.length > 0
            ? Math.max(...validCategories.map((cat) => cat.amount)) * 0.9
            : 0;

    const handleCategoryToggle = (category: string) => {
        let updatedCategories: string[];
        if (selectedCategories.includes(category)) {
            updatedCategories = selectedCategories.filter(
                (cat) => cat !== category
            );
        } else {
            updatedCategories = [...selectedCategories, category];
        }
        setSelectedCategories(updatedCategories);
        onFilterChange(updatedCategories);
    };

    // Bubble Size Scaling: Determine a scale factor based on spending proportion
    const getBubbleSize = (amount: number) => {
        const minSize = 60; // Minimum bubble size in pixels
        const maxSize = 150; // Maximum bubble size in pixels
        const proportion = totalSpending > 0 ? amount / totalSpending : 0;
        return minSize + proportion * (maxSize - minSize);
    };

    return (
        <>
            {/* Spending Lens Container */}
            <div className="flex flex-wrap justify-center items-center gap-6 p-6">
                {validCategories.map((cat, index) => {
                    const isSelected = selectedCategories.includes(
                        cat.category
                    );
                    const bubbleSize = getBubbleSize(cat.amount);
                    const isUnusual = cat.amount > thresholdAmount;

                    return (
                        <motion.div
                            key={`${cat.category}-${index}`}
                            className={`relative flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ${
                                isSelected
                                    ? "border-4 border-blue-500"
                                    : "border border-gray-300"
                            }`}
                            style={{
                                width: bubbleSize,
                                height: bubbleSize,
                                backgroundColor: isUnusual
                                    ? "#f87171"
                                    : "#3b82f6", // Red for unusual spending, Blue otherwise
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCategoryToggle(cat.category)}
                        >
                            <span className="text-white font-semibold text-center px-2">
                                {cat.category}
                            </span>
                            {isUnusual && (
                                <FaExclamationTriangle className="absolute top-2 right-2 text-yellow-300" />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Expandable Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsExpanded(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="fixed inset-0 flex items-center justify-center z-50 p-4"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="bg-white rounded-lg shadow-xl p-8 w-full max-w-5xl relative overflow-auto"
                                initial={{ y: -50 }}
                                animate={{ y: 0 }}
                                exit={{ y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Close Button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-3xl"
                                    onClick={() => setIsExpanded(false)}
                                    aria-label="Close Spending Lens"
                                >
                                    &times;
                                </button>

                                {/* Expanded Content */}
                                <h2 className="text-3xl font-bold mb-6 text-center">
                                    Spending Categories
                                </h2>
                                <div className="flex flex-wrap justify-center items-center gap-6">
                                    {validCategories.map((cat, index) => {
                                        const isSelected =
                                            selectedCategories.includes(
                                                cat.category
                                            );
                                        const bubbleSize = getBubbleSize(
                                            cat.amount
                                        );
                                        const isUnusual =
                                            cat.amount > thresholdAmount;

                                        return (
                                            <motion.div
                                                key={`${cat.category}-expanded-${index}`}
                                                className={`relative flex items-center justify-center rounded-full cursor-pointer transition-transform duration-300 ${
                                                    isSelected
                                                        ? "border-4 border-blue-500"
                                                        : "border border-gray-300"
                                                }`}
                                                style={{
                                                    width: bubbleSize,
                                                    height: bubbleSize,
                                                    backgroundColor: isUnusual
                                                        ? "#f87171"
                                                        : "#3b82f6",
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() =>
                                                    handleCategoryToggle(
                                                        cat.category
                                                    )
                                                }
                                            >
                                                <span className="text-white font-semibold text-center px-2">
                                                    {cat.category}
                                                </span>
                                                {isUnusual && (
                                                    <FaExclamationTriangle className="absolute top-2 right-2 text-yellow-300" />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Expand Button */}
            <div className="flex justify-center mt-4">
                <button
                    className="bg-gray-800 text-white px-4 py-2 rounded-full shadow hover:bg-gray-700 transition-colors duration-300"
                    onClick={() => setIsExpanded(true)}
                >
                    Expand Spending Lens
                </button>
            </div>
        </>
    );
};

export default SpendingLens;
