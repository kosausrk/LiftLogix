// ./src/components/Profile.js

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Link } from "react-router-dom"; // If you're using React Router for navigation

export default function Profile() {
  const [data, setData] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, [user]);

  if (!user) return <p>Loading user...</p>;
  if (!data) return <p>Loading profile data...</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
      <p className="text-white">Name: {data.name}</p>
      <p className="text-white">Squat: {data.squat} lbs</p>
      <p className="text-white">Bench: {data.bench} lbs</p>
      <p className="text-white">Deadlift: {data.deadlift} lbs</p>
      <p className="text-white">Total: {data.total} lbs</p>
      <p className="text-white">Rank: {data.rank}</p>
      
      {/* Optional: Button to edit profile */}
      <Link to="/edit-profile">
        <button className="bg-blue-500 text-white p-2 rounded mt-4 hover:bg-blue-600">
          Edit Profile
        </button>
      </Link>
    </div>
  );
}
