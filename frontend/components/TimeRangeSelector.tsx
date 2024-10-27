import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import "./TimeRangeSelector.css";

interface TimeRangeSelectorProps {
    onChange: (startDate: string, endDate: string) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({ onChange }) => {
    const [range, setRange] = useState({ start: 0, end: 119 });
    const sliderRef = useRef<HTMLDivElement>(null);
    const [sliderWidth, setSliderWidth] = useState(0);
    const totalMonths = 12 * 10;
    const handleType = useRef<"left" | "right" | null>(null);

    const months = useMemo(
        () =>
            Array.from({ length: totalMonths }, (_, index) => {
                const year = 2020 + Math.floor(index / 12);
                const month = index % 12;
                return { year, month };
            }),
        [totalMonths]
    );

    useEffect(() => {
        const updateSliderWidth = () => {
            if (sliderRef.current) {
                setSliderWidth(sliderRef.current.offsetWidth);
            }
        };
        updateSliderWidth();
        window.addEventListener("resize", updateSliderWidth);
        return () => window.removeEventListener("resize", updateSliderWidth);
    }, []);

    const startResizing = (
        direction: "left" | "right",
        event: React.MouseEvent
    ) => {
        event.preventDefault();
        handleType.current = direction;

        const initialMousePos = event.clientX;
        const initialRange = { ...range };

        const onMouseMove = (e: MouseEvent) => {
            const deltaX = e.clientX - initialMousePos;
            const deltaMonths = Math.round(
                (deltaX / sliderWidth) * totalMonths
            );

            setRange(() => {
                let newStart = initialRange.start;
                let newEnd = initialRange.end;

                if (handleType.current === "left") {
                    newStart = Math.max(
                        0,
                        Math.min(
                            initialRange.start + deltaMonths,
                            initialRange.end - 1
                        )
                    );
                } else if (handleType.current === "right") {
                    newEnd = Math.max(
                        initialRange.start + 1,
                        Math.min(
                            initialRange.end + deltaMonths,
                            totalMonths - 1
                        )
                    );
                }

                return { start: newStart, end: newEnd };
            });
        };

        const onMouseUp = () => {
            handleType.current = null;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const handleDrag = (event: any, info: any) => {
        const deltaX = info.delta.x;
        const deltaMonths = Math.round((deltaX / sliderWidth) * totalMonths);

        setRange((prevRange) => {
            let newStart = prevRange.start + deltaMonths;
            let newEnd = prevRange.end + deltaMonths;

            // Prevent dragging out of bounds
            if (newStart < 0) {
                newStart = 0;
                newEnd = newStart + (prevRange.end - prevRange.start);
            }

            if (newEnd > totalMonths - 1) {
                newEnd = totalMonths - 1;
                newStart = newEnd - (prevRange.end - prevRange.start);
            }

            // Only update if the range has actually changed
            if (newStart !== prevRange.start || newEnd !== prevRange.end) {
                return { start: newStart, end: newEnd };
            }
            return prevRange;
        });
    };

    // Call onChange whenever range changes
    useEffect(() => {
        const startDate = new Date(
            months[range.start].year,
            months[range.start].month,
            1
        );
        const endDate = new Date(
            months[range.end].year,
            months[range.end].month + 1,
            0
        ); // Last day of the end month

        console.log("Selected Date Range:", startDate, endDate); // Debugging line
        onChange(
            startDate.toISOString().split("T")[0],
            endDate.toISOString().split("T")[0]
        );
    }, [range, months, onChange]);

    return (
        <div className="time-range-selector" ref={sliderRef}>
            <div className="ruler">
                {months.map(({ year, month }, index) => {
                    const isYearStart = month === 0;
                    return (
                        <div key={index} className="ruler-mark">
                            {isYearStart && (
                                <div className="year-label">{year}</div>
                            )}
                            <div
                                className={`tick ${
                                    isYearStart ? "major" : "minor"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>

            <motion.div
                className="slider-window"
                style={{
                    left: `${(range.start / totalMonths) * 100}%`,
                    width: `${
                        ((range.end - range.start + 1) / totalMonths) * 100
                    }%`,
                }}
                drag="x"
                dragElastic={0}
                dragConstraints={{ left: 0, right: 0 }}
                onDrag={handleDrag}
                initial={{ opacity: 0.8 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
            >
                <div
                    className="range-handle left-handle"
                    onMouseDown={(e) => startResizing("left", e)}
                />
                <div className="range-content">
                    <span className="selected-range">
                        {months[range.start].month + 1}/
                        {months[range.start].year} -{" "}
                        {months[range.end].month + 1}/{months[range.end].year}
                    </span>
                </div>
                <div
                    className="range-handle right-handle"
                    onMouseDown={(e) => startResizing("right", e)}
                />
            </motion.div>
        </div>
    );
};

export default TimeRangeSelector;
