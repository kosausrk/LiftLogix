import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function ProgressChart() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(
        collection(db, "users", user.uid, "liftHistory"),
        orderBy("updatedAt", "asc")
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => doc.data());
      setHistory(data);
    };

    fetchHistory();
  }, []);

  if (history.length === 0) return <p className="text-gray-400 mt-6">No lift history yet.</p>;

  const labels = history.map(entry => new Date(entry.updatedAt).toLocaleDateString());
  const totalData = history.map(entry => entry.total);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Lift (lbs)",
        data: totalData,
        borderColor: "#10B981",
        backgroundColor: "#10B98133",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded mt-6">
      <h2 className="text-xl font-semibold text-white mb-4">Progress Over Time</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
