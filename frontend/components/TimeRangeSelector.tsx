import React, { useState } from "react";
import { motion } from "framer-motion";
import "./TimeRangeSelector.css";

const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const TimeRangeSelector: React.FC = () => {
    const [range, setRange] = useState({ start: 0, end: 2 });

    const handleDrag = (
        event: React.MouseEvent,
        direction: "left" | "right"
    ) => {
        const delta = direction === "left" ? -1 : 1;
        setRange((prevRange) => {
            const newStart = Math.max(0, prevRange.start + delta);
            const newEnd = Math.min(months.length - 1, prevRange.end + delta);
            return { start: newStart, end: newEnd };
        });
    };

    return (
        <div className="time-range-selector">
            <div className="months-container">
                {months.map((month, index) => (
                    <motion.div
                        key={month}
                        className={`month ${
                            index >= range.start && index <= range.end
                                ? "active"
                                : ""
                        }`}
                    >
                        {month}
                    </motion.div>
                ))}
                <div
                    className="range-handle left-handle"
                    onMouseDown={(e) => handleDrag(e, "left")}
                />
                <div
                    className="range-handle right-handle"
                    onMouseDown={(e) => handleDrag(e, "right")}
                />
            </div>
        </div>
    );
};

export default TimeRangeSelector;
