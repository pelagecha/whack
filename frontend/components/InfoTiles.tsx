// InfoTiles.tsx
import React from "react";

interface InfoTilesProps {
    balance: number;
    totalSpending: number;
    spendingIncrease: number;
    transactionCount: number;
}

const InfoTiles: React.FC<InfoTilesProps> = ({
    balance,
    totalSpending,
    spendingIncrease,
    transactionCount,
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    Current Balance
                </h2>
                <p className="text-3xl text-green-600 font-extrabold mt-4">
                    ${balance.toFixed(2)}
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    Total Spending
                </h2>
                <p className="text-3xl text-red-600 font-extrabold mt-4">
                    ${totalSpending.toFixed(2)}
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    Spending Increase
                </h2>
                <p className="text-3xl text-yellow-500 font-extrabold mt-4">
                    {spendingIncrease.toFixed(2)}%
                </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-700">
                    Transactions Count
                </h2>
                <p className="text-3xl text-blue-600 font-extrabold mt-4">
                    {transactionCount}
                </p>
            </div>
        </div>
    );
};

export default InfoTiles;
