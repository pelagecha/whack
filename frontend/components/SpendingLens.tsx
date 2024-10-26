// frontend/components/SpendingLens.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaExclamationTriangle } from "react-icons/fa";
import * as d3 from "d3";
import "./spendingLens.css"; // Import the separate CSS file

interface ICategoryData {
    category: string;
    amount: number;
}

interface ISpendingLensProps {
    categories: ICategoryData[];
    onFilterChange: (categories: string[]) => void;
}

interface BubbleData extends ICategoryData {
    radius: number;
    x: number;
    y: number;
}

const SpendingLens: React.FC<ISpendingLensProps> = ({
    categories,
    onFilterChange,
}) => {
    const [selectedCategories, setSelectedCategories] = useState<string[]>(
        categories.map((cat) => cat.category)
    );
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);

    // Calculate total spending to determine proportions
    const totalSpending = categories.reduce(
        (total, cat) => total + cat.amount,
        0
    );

    // Define a threshold for unusual spending (e.g., top 10% spenders)
    const thresholdAmount =
        categories.length > 0
            ? d3.quantile(
                  categories.map((cat) => cat.amount).sort(d3.ascending),
                  0.9
              ) || 0
            : 0;

    // Initialize bubbles with radius based on amount
    useEffect(() => {
        const logScale = d3
            .scaleSqrt()
            .domain([1, d3.max(categories, (d) => d.amount)!])
            .range([30, 80]);

        const initialBubbles: BubbleData[] = categories.map((cat) => ({
            ...cat,
            radius: logScale(cat.amount),
            x: Math.random() * 800, // Initial random positions
            y: Math.random() * 600,
        }));

        setBubbles(initialBubbles);
    }, [categories]);

    // Set up D3 force simulation
    useEffect(() => {
        if (bubbles.length === 0) return;

        const simulation = d3
            .forceSimulation<BubbleData>(bubbles)
            .force("charge", d3.forceManyBody().strength(5))
            .force("center", d3.forceCenter(400, 300))
            .force(
                "collision",
                d3.forceCollide().radius((d) => d.radius + 2)
            )
            .on("tick", () => {
                setBubbles([...bubbles]);
            });

        return () => {
            simulation.stop();
        };
    }, [bubbles]);

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

    // Bubble Size Scaling: Already handled by radius in D3
    // Log scale ensures better handling of large ranges

    return (
        <>
            {/* Spending Lens Container */}
            <div className="spending-lens">
                <h2 className="spending-lens-title">Spending Lens</h2>
                <div className="bubble-container">
                    <svg ref={svgRef} className="bubble-svg">
                        {bubbles.map((cat, index) => {
                            const isSelected = selectedCategories.includes(
                                cat.category
                            );
                            const isUnusual = cat.amount > thresholdAmount;

                            return (
                                <motion.g
                                    key={`${cat.category}-${index}`}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <motion.circle
                                        cx={cat.x}
                                        cy={cat.y}
                                        r={cat.radius}
                                        fill={isUnusual ? "#f87171" : "#3b82f6"} // Red for unusual, Blue otherwise
                                        stroke={
                                            isSelected ? "#2563eb" : "#ffffff"
                                        }
                                        strokeWidth={isSelected ? 4 : 2}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() =>
                                            handleCategoryToggle(cat.category)
                                        }
                                        tabIndex={0}
                                        role="button"
                                        aria-pressed={isSelected}
                                        aria-label={`Toggle category ${cat.category}`}
                                        onKeyDown={(e) => {
                                            if (
                                                e.key === "Enter" ||
                                                e.key === " "
                                            ) {
                                                handleCategoryToggle(
                                                    cat.category
                                                );
                                            }
                                        }}
                                    />
                                    <text
                                        x={cat.x}
                                        y={cat.y}
                                        textAnchor="middle"
                                        alignmentBaseline="middle"
                                        className="bubble-text"
                                        fill={isUnusual ? "#ffffff" : "#ffffff"}
                                    >
                                        {cat.category}
                                    </text>
                                    {isUnusual && (
                                        <FaExclamationTriangle
                                            className="indicator-icon"
                                            style={{
                                                position: "absolute",
                                                left: cat.x + cat.radius - 10,
                                                top: cat.y - cat.radius - 10,
                                                color: "#ffeb3b",
                                                fontSize: "18px",
                                                pointerEvents: "none",
                                            }}
                                        />
                                    )}
                                </motion.g>
                            );
                        })}
                    </svg>
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
                                <div className="bubble-container-expanded">
                                    <svg className="bubble-svg-expanded">
                                        {bubbles.map((cat, index) => {
                                            const isSelected =
                                                selectedCategories.includes(
                                                    cat.category
                                                );
                                            const isUnusual =
                                                cat.amount > thresholdAmount;

                                            return (
                                                <motion.g
                                                    key={`${cat.category}-expanded-${index}`}
                                                    initial={{
                                                        opacity: 0,
                                                        scale: 0.5,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        scale: 1,
                                                    }}
                                                    transition={{
                                                        duration: 0.5,
                                                    }}
                                                >
                                                    <motion.circle
                                                        cx={cat.x}
                                                        cy={cat.y}
                                                        r={cat.radius}
                                                        fill={
                                                            isUnusual
                                                                ? "#f87171"
                                                                : "#3b82f6"
                                                        } // Red for unusual, Blue otherwise
                                                        stroke={
                                                            isSelected
                                                                ? "#2563eb"
                                                                : "#ffffff"
                                                        }
                                                        strokeWidth={
                                                            isSelected ? 4 : 2
                                                        }
                                                        whileHover={{
                                                            scale: 1.05,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.95,
                                                        }}
                                                        onClick={() =>
                                                            handleCategoryToggle(
                                                                cat.category
                                                            )
                                                        }
                                                        tabIndex={0}
                                                        role="button"
                                                        aria-pressed={
                                                            isSelected
                                                        }
                                                        aria-label={`Toggle category ${cat.category}`}
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                    "Enter" ||
                                                                e.key === " "
                                                            ) {
                                                                handleCategoryToggle(
                                                                    cat.category
                                                                );
                                                            }
                                                        }}
                                                    />
                                                    <text
                                                        x={cat.x}
                                                        y={cat.y}
                                                        textAnchor="middle"
                                                        alignmentBaseline="middle"
                                                        className="bubble-text"
                                                        fill={
                                                            isUnusual
                                                                ? "#ffffff"
                                                                : "#ffffff"
                                                        }
                                                    >
                                                        {cat.category}
                                                    </text>
                                                    {isUnusual && (
                                                        <FaExclamationTriangle
                                                            className="indicator-icon"
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                left:
                                                                    cat.x +
                                                                    cat.radius -
                                                                    10,
                                                                top:
                                                                    cat.y -
                                                                    cat.radius -
                                                                    10,
                                                                color: "#ffeb3b",
                                                                fontSize:
                                                                    "18px",
                                                                pointerEvents:
                                                                    "none",
                                                            }}
                                                        />
                                                    )}
                                                </motion.g>
                                            );
                                        })}
                                    </svg>
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
