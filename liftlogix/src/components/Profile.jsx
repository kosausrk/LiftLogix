import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);  // New loading state
  const [error, setError] = useState(null);  // New error state
  const user = auth.currentUser;

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setError("No user is logged in.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setData(docSnap.data());
        } else {
          setError("No profile data found.");
        }
      } catch (err) {
        setError("Failed to load profile data.");
        console.error("Error fetching profile:", err);
      }
      setLoading(false);  // End the loading state
    };

    fetchData();
  }, [user]);

  // Show loading message or error message
  if (loading) return <p>Loading your profile...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
      <p className="text-white">
      Name: {data.displayName || user.displayName || "Unnamed"}
      </p>

      <p className="text-white">Squat: {data.squat} lbs</p>
      <p className="text-white">Bench: {data.bench} lbs</p>
      <p className="text-white">Deadlift: {data.deadlift} lbs</p>
      <p className="text-white">Total: {data.total} lbs</p>
      <p className="text-white">Rank: {data.rank}</p>

      


        {/* Link to EditProfile page */}
        <Link to="/edit-profile">
        <button className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
        Edit Profile
        </button>
        </Link>

    </div>
  );
}
