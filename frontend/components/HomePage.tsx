"use client";

import { useState, useEffect, useCallback } from "react";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";
import TimeRangeSelector from "./TimeRangeSelector";
import Header from "../components/Header";
import InfoTiles from "../components/InfoTiles";
import { useDataContext } from "./DataContext";

export default function HomePage() {
    const {
        filteredData,
        categoriesData,
        balance,
        totalSpending,
        spendingIncrease,
        handleFilterChange,
        handleTimeRangeChange,
    } = useDataContext();

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />

            <main className="flex-grow container mx-auto p-8">
                <div className="mb-8">
                    <TimeRangeSelector onChange={handleTimeRangeChange} />
                </div>

                <InfoTiles
                    balance={balance}
                    totalSpending={totalSpending}
                    spendingIncrease={spendingIncrease}
                    transactionCount={filteredData.length}
                />

                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SpendingLens
                                categories={categoriesData}
                                onFilterChange={handleFilterChange}
                            />
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-8">
                            <SpendingGraph data={filteredData} />
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-xl mb-8 text-gray-700">
                            No transactions available.
                        </p>
                    </div>
                )}
            </main>

            <footer className="bg-gray-900 text-white p-4 text-center">
                <p>&copy; 2024 Clean my Credit. All rights reserved.</p>
            </footer>
        </div>
    );
}
