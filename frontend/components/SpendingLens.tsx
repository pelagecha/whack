// frontend/components/SpendingLens.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "./spendingLens.css";

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
    isSelected: boolean;
}

const SpendingLens: React.FC<ISpendingLensProps> = ({
    categories,
    onFilterChange,
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [bubbles, setBubbles] = useState<BubbleData[]>([]);
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Initialize bubbles with radius based on amount and setup a force simulation
    useEffect(() => {
        const maxAmount = d3.max(categories, (d) => d.amount) || 1;
        const logScale = d3.scaleSqrt().domain([1, maxAmount]).range([30, 80]);

        const initialBubbles: BubbleData[] = categories.map((cat) => ({
            ...cat,
            radius: logScale(cat.amount),
            x: Math.random() * 600,
            y: Math.random() * 400,
            isSelected: false,
        }));

        const containerWidth = containerRef.current?.offsetWidth || 800;
        const containerHeight = containerRef.current?.offsetHeight || 400;

        // Use D3 force simulation to prevent bubbles from overlapping
        const simulation = d3
            .forceSimulation(initialBubbles)
            .force("x", d3.forceX(containerWidth / 2).strength(0.05))
            .force("y", d3.forceY(containerHeight / 2).strength(0.05))
            .force(
                "collision",
                d3.forceCollide<BubbleData>().radius((d) => d.radius + 5)
            )
            .on("tick", () => {
                setBubbles([...simulation.nodes()]);
            });

        simulation.alpha(0.5).restart();

        return () => {
            simulation.stop();
        };
    }, [categories]);

    const handleCategoryToggle = (category: string) => {
        const updatedCategory = selectedCategory === category ? null : category;
        setSelectedCategory(updatedCategory);

        const updatedBubbles = bubbles.map((bubble) => ({
            ...bubble,
            isSelected: bubble.category === updatedCategory,
        }));

        setBubbles(updatedBubbles);
        onFilterChange(updatedCategory ? [updatedCategory] : []);
    };

    return (
        <div className="spending-lens" ref={containerRef}>
            <h2 className="spending-lens-title">Spending Lens</h2>
            <div className="bubble-container">
                <svg ref={svgRef} className="bubble-svg">
                    {bubbles.map((cat, index) => (
                        <motion.g
                            key={`${cat.category}-${index}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <motion.circle
                                cx={cat.x}
                                cy={cat.y}
                                r={
                                    cat.isSelected
                                        ? cat.radius * 1.2
                                        : cat.radius
                                }
                                fill={cat.isSelected ? "#2563eb" : "#60a5fa"}
                                stroke="#ffffff"
                                strokeWidth={2}
                                opacity={0.8}
                                whileHover={{ scale: 1.1 }}
                                onClick={() =>
                                    handleCategoryToggle(cat.category)
                                }
                                data-tooltip-id={`tooltip-${index}`}
                                data-tooltip-content={`$${cat.amount.toFixed(
                                    2
                                )}`}
                            />
                            <text
                                x={cat.x}
                                y={cat.y}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                                className="bubble-text"
                                fill="#ffffff"
                            >
                                {cat.category}
                            </text>
                            <Tooltip id={`tooltip-${index}`} />
                        </motion.g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default SpendingLens;
