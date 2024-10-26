import { useState } from "react";

type DataItem = {
    id: string;
    date: string;
    category: string;
    amount: number;
};

type SortConfig = {
    key: keyof DataItem;
    direction: "ascending" | "descending";
} | null;

const DataTable = ({ data }: { data: DataItem[] }) => {
    const [sortConfig, setSortConfig] = useState<SortConfig>(null);

    const sortedData = [...data].sort((a, b) => {
        if (sortConfig !== null) {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === "ascending" ? 1 : -1;
            }
        }
        return 0;
    });

    const requestSort = (key: keyof DataItem) => {
        let direction = "ascending";
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === "ascending"
        ) {
            direction = "descending";
        }
        setSortConfig({
            key,
            direction: direction as "ascending" | "descending",
        });
    };

    return (
        <table>
            <thead>
                <tr>
                    <th onClick={() => requestSort("date")}>Date</th>
                    <th onClick={() => requestSort("category")}>Category</th>
                    <th onClick={() => requestSort("amount")}>Amount</th>
                </tr>
            </thead>
            <tbody>
                {sortedData.map((item) => (
                    <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>{item.category}</td>
                        <td>{item.amount}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default DataTable;
