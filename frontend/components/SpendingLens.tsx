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
    color: string;
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

    useEffect(() => {
        const maxAmount = d3.max(categories, (d) => d.amount) || 1;
        const radiusScale = d3
            .scaleSqrt()
            .domain([0, maxAmount])
            .range([20, 80]);

        // Create a color scale for categories
        const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        const initialBubbles: BubbleData[] = categories.map((cat) => ({
            ...cat,
            radius: radiusScale(cat.amount),
            x: Math.random() * 600,
            y: Math.random() * 400,
            isSelected: false,
            color: colorScale(cat.category),
        }));

        const containerWidth = containerRef.current?.offsetWidth || 800;
        const containerHeight = containerRef.current?.offsetHeight || 400;

        // D3 force simulation to prevent bubbles from overlapping
        const simulation = d3
            .forceSimulation(initialBubbles)
            .force(
                "center",
                d3.forceCenter(containerWidth / 2, containerHeight / 2)
            )
            .force(
                "collision",
                d3.forceCollide<BubbleData>().radius((d) => d.radius + 2)
            )
            .on("tick", () => {
                setBubbles([...simulation.nodes()]);
            });

        simulation.alpha(1).restart();

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
                                fill={cat.color}
                                stroke="#ffffff"
                                strokeWidth={2}
                                opacity={0.9}
                                whileHover={{ scale: 1.1 }}
                                onClick={() =>
                                    handleCategoryToggle(cat.category)
                                }
                                data-tooltip-id={`tooltip-${index}`}
                                data-tooltip-content={`${
                                    cat.category
                                }: $${cat.amount.toFixed(2)}`}
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
