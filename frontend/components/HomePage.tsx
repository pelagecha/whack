import { useState, useEffect } from "react";
import SpendingGraph from "../components/SpendingGraph";
import SpendingLens from "../components/SpendingLens";
import TimeRangeSelector from "./TimeRangeSelector";
import Header from "../components/Header";
import InfoTiles from "../components/InfoTiles";
import { useDataContext } from "./DataContext";
import ChatUI from "./ChatUI";
import Login from "./Login";

export default function HomePage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/login");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const data = await response.json();
                if (data.successful) {
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error("Error checking login status:", error);
            }
        };

        checkLoginStatus();
    }, []);

    if (!isLoggedIn) {
        return <Login />;
    } else {
        return <div>Login successful! Welcome to your homepage.</div>;
    }

    // const {
    //     filteredData,
    //     categoriesData,
    //     balance,
    //     totalSpending,
    //     spendingIncrease,
    //     handleFilterChange,
    //     handleTimeRangeChange,
    // } = useDataContext();

    // return (
    //     <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-blue-100">
    //         <Header />
    //         <main className="flex-grow container mx-auto p-6 lg:p-12 space-y-8">
    //             <div className="mb-8">
    //                 <TimeRangeSelector onChange={handleTimeRangeChange} />
    //             </div>
    //             <InfoTiles
    //                 balance={balance}
    //                 totalSpending={totalSpending}
    //                 spendingIncrease={spendingIncrease}
    //                 transactionCount={filteredData.length}
    //             />
    //             {filteredData.length > 0 ? (
    //                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    //                     <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
    //                         <SpendingLens
    //                             categories={categoriesData}
    //                             onFilterChange={handleFilterChange}
    //                         />
    //                     </div>
    //                     <div className="bg-white rounded-xl shadow-lg p-8 lg:col-span-2 hover:shadow-xl transition-shadow duration-300">
    //                         <SpendingGraph data={filteredData} />
    //                     </div>
    //                     <div className="bg-white rounded-xl shadow-lg p-8 lg:col-span-3 hover:shadow-xl transition-shadow duration-300">
    //                         <ChatUI />
    //                     </div>
    //                 </div>
    //             ) : (
    //                 <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-lg p-8">
    //                     <p className="text-2xl font-semibold text-gray-700">
    //                         No transactions available.
    //                     </p>
    //                 </div>
    //             )}
    //         </main>
    //         <footer className="bg-gray-900 text-white p-4 text-center">
    //             <p className="text-sm tracking-wide font-medium">
    //                 &copy; 2024 Clean my Credit. All rights reserved.
    //             </p>
    //         </footer>
    //     </div>
    // );
}
