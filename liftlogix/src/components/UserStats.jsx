import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

export default function UserStats() {
  const [data, setData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    };
    fetchData();
  }, [user]);

  if (!user) return <p>Loading user...</p>;
  if (!data) return <p>Loading stats...</p>;

  return (
    <div className="bg-emerald-600 p-4 rounded mt-6">
      <h2 className="text-lg font-semibold mb-2">Your Stats</h2>
      <p>🛋 Bench: {data.bench} lbs</p>
      <p>🏋️‍♂️ Squat: {data.squat} lbs</p>
      <p>💀 Deadlift: {data.deadlift} lbs</p>
      <p>⚖️ Total: {data.total} lbs</p>
      <p>🏅 Rank: <strong>{data.rank}</strong></p>
    </div>
  );
}
