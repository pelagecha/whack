import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useAuthContext } from "../context/AuthContext";

interface Transaction {
    accountno: string;
    category: string;
    id: number;
    ref: string;
    time: string;
    val: number;
}

interface DataContextProps {
    data: Transaction[];
    filteredData: Transaction[];
    categoriesData: { category: string; amount: number }[];
    balance: number;
    totalSpending: number;
    spendingIncrease: number;
    handleFilterChange: (selectedCategories: string[]) => void;
    handleTimeRangeChange: (startDate: string, endDate: string) => void;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [data, setData] = useState<Transaction[]>([]);
    const [categoriesData, setCategoriesData] = useState<
        { category: string; amount: number }[]
    >([]);
    const [filteredData, setFilteredData] = useState<Transaction[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [totalSpending, setTotalSpending] = useState<number>(0);
    const [spendingIncrease, setSpendingIncrease] = useState<number>(0);
    const { isLoggedIn } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            if (!isLoggedIn) return;

            try {
                const response = await fetch("http://localhost:5000/home", {
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                const jsonData: Transaction[] = await response.json();
                setData(jsonData);
                setFilteredData(jsonData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [isLoggedIn]);

    useEffect(() => {
        const categoryMap: { [key: string]: number } = {};
        let totalSpent = 0;

        data.forEach((transaction) => {
            if (transaction.category && typeof transaction.val === "number") {
                categoryMap[transaction.category] =
                    (categoryMap[transaction.category] || 0) +
                    Math.abs(transaction.val);
                totalSpent += Math.abs(transaction.val);
            }
        });

        const categories = Object.keys(categoryMap).map((cat) => ({
            category: cat,
            amount: categoryMap[cat],
        }));

        setCategoriesData(categories);
        setTotalSpending(totalSpent);

        const income = data
            .filter((transaction) => transaction.val > 0)
            .reduce((acc, transaction) => acc + transaction.val, 0);
        const expenses = data
            .filter((transaction) => transaction.val < 0)
            .reduce((acc, transaction) => acc + transaction.val, 0);
        setBalance(income + expenses);
    }, [data]);

    useEffect(() => {
        if (filteredData.length > 0) {
            const halfIndex = Math.floor(filteredData.length / 2);
            const firstHalf = filteredData.slice(0, halfIndex);
            const secondHalf = filteredData.slice(halfIndex);

            const firstHalfSpending = firstHalf
                .filter((transaction) => transaction.val < 0)
                .reduce(
                    (acc, transaction) => acc + Math.abs(transaction.val),
                    0
                );

            const secondHalfSpending = secondHalf
                .filter((transaction) => transaction.val < 0)
                .reduce(
                    (acc, transaction) => acc + Math.abs(transaction.val),
                    0
                );

            if (firstHalfSpending > 0) {
                setSpendingIncrease(
                    ((secondHalfSpending - firstHalfSpending) /
                        firstHalfSpending) *
                        100
                );
            }
        }
    }, [filteredData]);

    const handleFilterChange = (selectedCategories: string[]) => {
        if (selectedCategories.length === 0) {
            setFilteredData(data);
        } else {
            const updatedData = data.filter((transaction) =>
                selectedCategories.includes(transaction.category)
            );
            setFilteredData(updatedData);
        }
    };

    const handleTimeRangeChange = useCallback(
        (startDate: string, endDate: string) => {
            const updatedData = data.filter((transaction) => {
                const transactionDate = new Date(transaction.time);
                return (
                    transactionDate >= new Date(startDate) &&
                    transactionDate <= new Date(endDate)
                );
            });
            setFilteredData(updatedData);
        },
        [data]
    );

    return (
        <DataContext.Provider
            value={{
                data,
                filteredData,
                categoriesData,
                balance,
                totalSpending,
                spendingIncrease,
                handleFilterChange,
                handleTimeRangeChange,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error("useDataContext must be used within a DataProvider");
    }
    return context;
};
