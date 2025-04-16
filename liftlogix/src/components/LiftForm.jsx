import { useState, useEffect } from 'react';
import { db } from "../firebase";
import { auth } from "../firebase";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

export default function LiftForm() {
  const [squat, setSquat] = useState("");
  const [bench, setBench] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const [userDataExists, setUserDataExists] = useState(false);
  const user = auth.currentUser;

  const calculateRank = (total) => {
    if (total >= 1200) return "Olympian";
    if (total >= 1000) return "Elite";
    if (total >= 800) return "Advanced";
    if (total >= 600) return "Intermediate";
    return "Wood";
  };

  useEffect(() => {
    const checkUserData = async () => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserDataExists(true);
      } else {
        setUserDataExists(false);
      }
    };

    checkUserData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const s = parseInt(squat);
    const b = parseInt(bench);
    const d = parseInt(deadlift);
    const total = s + b + d;
    const rank = calculateRank(total);

    const data = {
      displayName: user.displayName,
      squat: s,
      bench: b,
      deadlift: d,
      total,
      rank,
      updatedAt: Date.now(),
    };

    try {
      // If user data exists, update it; otherwise, create new document
      if (userDataExists) {
        await setDoc(doc(db, "users", user.uid), data);
      } else {
        await setDoc(doc(db, "users", user.uid), data); // Create new document
      }

      // Store in liftHistory collection
      const historyRef = collection(db, "users", user.uid, "liftHistory");
      await addDoc(historyRef, data);

      alert("Lifts updated!");
    } catch (err) {
      console.error("Error saving lifts: ", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg">
    <h2 className="text-2xl font-semibold text-center mb-6">Enter Your Lifts</h2>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="squat" className="block text-lg font-medium text-gray-700">Squat (lbs)</label>
        <input
          type="number"
          id="squat"
          value={squat}
          onChange={(e) => setSquat(e.target.value)}
          className="mt-2 w-full p-4 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="bench" className="block text-lg font-medium text-gray-700">Bench (lbs)</label>
        <input
          type="number"
          id="bench"
          value={bench}
          onChange={(e) => setBench(e.target.value)}
          className="mt-2 w-full p-4 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="deadlift" className="block text-lg font-medium text-gray-700">Deadlift (lbs)</label>
        <input
          type="number"
          id="deadlift"
          value={deadlift}
          onChange={(e) => setDeadlift(e.target.value)}
          className="mt-2 w-full p-4 border border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="flex justify-center">
        <button
          type="submit"
          className="mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Save Lifts
        </button>
      </div>
    </form>
  </div>
);

}
