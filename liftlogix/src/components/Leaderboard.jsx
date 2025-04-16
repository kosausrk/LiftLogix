import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const q = query(
          collection(db, "users"),
          orderBy("total", "desc"),
          limit(10) // Limiting to top 10 users, adjust as needed
        );
        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => doc.data());
        setLeaderboard(users);
      } catch (error) {
        console.error("Error fetching leaderboard: ", error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="bg-gray-800 p-4 rounded mt-6">
      <h2 className="text-xl font-semibold mb-4 text-white">Leaderboard</h2>
      <ul>
        {leaderboard.map((user, index) => (
          <li key={index} className="text-white mb-2">
            <span className="font-bold">{index + 1}. {user.displayName}</span> - {user.total} lbs (Rank: {user.rank})
          </li>
        ))}
      </ul>
    </div>
  );
}
