import {
    Chart,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register the necessary components
Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface IData {
    date: string;
    amount: number;
}

interface ISpendingGraphProps {
    data: IData[];
}

const SpendingGraph: React.FC<ISpendingGraphProps> = ({ data }) => {
    const chartData = {
        labels: data.map((item) => item.date),
        datasets: [
            {
                label: "Spending",
                data: data.map((item) => item.amount),
                fill: false,
                backgroundColor: "rgb(75, 192, 192)",
                borderColor: "rgba(75, 192, 192, 0.2)",
            },
        ],
    };

    return <Line data={chartData} />;
};

export default SpendingGraph;
