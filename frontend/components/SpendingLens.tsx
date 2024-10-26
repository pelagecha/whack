// frontend/components/SpendingLens.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import "./spendingLens.css"; // Import the separate CSS file

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
    // Initialize selectedCategories with all categories selected by default
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categories.map((cat) => cat.category)
    );
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    // Calculate total spending to determine proportions
    const totalSpending = categories.reduce(
        (total, cat) => total + cat.amount,
        0
    );

    // Define a threshold for unusual spending (e.g., top 10% spenders)
    const thresholdAmount =
        categories.length > 0
            ? Math.max(...categories.map((cat) => cat.amount)) * 0.9
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
            <div className="spending-lens">
                <h2 className="spending-lens-title">Spending Lens</h2>
                <div className="categories">
                    {categories.map((cat, index) => {
                        const isSelected = selectedCategories.includes(
                            cat.category
                        );
                        const bubbleSize = getBubbleSize(cat.amount);
                        const isUnusual = cat.amount > thresholdAmount;

                        return (
                            <motion.div
                                key={`${cat.category}-${index}`}
                                className={`category-item ${
                                    isSelected ? "selected" : ""
                                }`}
                                style={{
                                    width: `${bubbleSize}px`,
                                    height: `${bubbleSize}px`,
                                    backgroundColor: isUnusual
                                        ? "#f87171"
                                        : "#3b82f6", // Red for unusual spending, Blue otherwise
                                }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() =>
                                    handleCategoryToggle(cat.category)
                                }
                            >
                                <span className="category-name">
                                    {cat.category}
                                </span>
                                <span className="category-amount">
                                    ${cat.amount.toFixed(2)}
                                </span>
                                {isUnusual && (
                                    <FaExclamationTriangle className="indicator-icon" />
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {/* Expandable Modal */}
            <AnimatePresence>
                {isExpanded && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            className="modal-overlay"
                            onClick={() => setIsExpanded(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Modal Content */}
                        <motion.div
                            className="modal-content"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <motion.div
                                className="modal-inner"
                                initial={{ y: -50 }}
                                animate={{ y: 0 }}
                                exit={{ y: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Close Button */}
                                <button
                                    className="modal-close-button"
                                    onClick={() => setIsExpanded(false)}
                                    aria-label="Close Spending Lens"
                                >
                                    &times;
                                </button>

                                {/* Expanded Spending Lens */}
                                <h2 className="modal-title">
                                    Spending Lens - Expanded View
                                </h2>
                                <div className="categories-expanded">
                                    {categories.map((cat, index) => {
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
                                                className={`category-item-expanded ${
                                                    isSelected ? "selected" : ""
                                                }`}
                                                style={{
                                                    width: `${bubbleSize}px`,
                                                    height: `${bubbleSize}px`,
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
                                                <span className="category-name">
                                                    {cat.category}
                                                </span>
                                                <span className="category-amount">
                                                    ${cat.amount.toFixed(2)}
                                                </span>
                                                {isUnusual && (
                                                    <FaExclamationTriangle className="indicator-icon" />
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
            <div className="expand-button-container">
                <button
                    className="expand-button"
                    onClick={() => setIsExpanded(true)}
                >
                    Expand Spending Lens
                </button>
            </div>
        </>
    );
};

export default SpendingLens;
