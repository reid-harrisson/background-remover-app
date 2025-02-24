import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

import { data } from "@/consts";

const DataChart = () => {
  const chartData = {
    labels: Object.keys(data).map((key) => key), // Keys as labels
    datasets: [
      {
        label: "Count",
        data: Object.values(data).map((item) => item.Count), // Counts as data
        backgroundColor: Object.values(data).map((item) => item.Color), // Colors
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Data Count by Key",
      },
    },
  };

  return <Bar data={chartData} />;
};

export default DataChart;
