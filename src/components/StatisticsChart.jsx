import { useEffect, useState, useRef } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getRandomColor } from "../../utils/getRandomColor";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const StatisticsChart = ({ statisticsData }) => {
  const [chartData, setChartData] = useState(null);
  const colorsRef = useRef([]);

  useEffect(() => {
    if (colorsRef.current.length === 0) {
      statisticsData.forEach(() => {
        colorsRef.current.push(getRandomColor());
      });
    }

    const maxLength = Math.max(...statisticsData.map((arr) => arr.length));
    const labels = Array.from(
      { length: maxLength },
      (_, index) => `${index + 1}`,
    );

    const datasets = statisticsData.map((agentData, index) => {
      const color = colorsRef.current[index];
      return {
        label: `Agent ${index + 1}`,
        data: agentData,
        borderColor: color,
        backgroundColor: color + "33",
        borderWidth: 1,
      };
    });

    setChartData({
      labels,
      datasets,
    });
  }, [statisticsData]);

  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: "Кількість разів досягнення цілі",
        },
      },
      y: {
        title: {
          display: true,
          text: "Ціль досягнута на епосі",
        },
      },
    },
  };

  return (
    <>
      {chartData && (
        <Line
          data={chartData}
          options={options}
          style={{
            maxWidth: "600px",
            width: "100%",
            maxHeight: "420px",
            height: "100%",
          }}
        />
      )}
    </>
  );
};

export default StatisticsChart;
