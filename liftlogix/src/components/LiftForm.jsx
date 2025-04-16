import { useState } from "react";
import { db } from "../firebase";
import { auth } from "../firebase";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";

export default function LiftForm() {
  const [squat, setSquat] = useState("");
  const [bench, setBench] = useState("");
  const [deadlift, setDeadlift] = useState("");
  const user = auth.currentUser;

  // World record limits (in lbs)
  const WORLD_RECORDS = {
    squat: 1200,
    bench: 1000,
    deadlift: 1100,
  };

  // Adjusted rank thresholds based on typical lbs standards
  const calculateRank = (total) => {
    if (total >= 1200) return "Olympian";
    if (total >= 1000) return "Elite";
    if (total >= 800) return "Advanced";
    if (total >= 600) return "Intermediate";
    return "Wood";
  };

  const validateLifts = (s, b, d) => {
    // Check if any lift is negative
    if (s < 0 || b < 0 || d < 0) {
      return "Lift values cannot be negative.";
    }

    // Check if any lift exceeds world record limits
    if (s > WORLD_RECORDS.squat) {
      return `Squat cannot exceed ${WORLD_RECORDS.squat} lbs (World Record).`;
    }
    if (b > WORLD_RECORDS.bench) {
      return `Bench cannot exceed ${WORLD_RECORDS.bench} lbs (World Record).`;
    }
    if (d > WORLD_RECORDS.deadlift) {
      return `Deadlift cannot exceed ${WORLD_RECORDS.deadlift} lbs (World Record).`;
    }

    return null; // No errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const s = parseInt(squat);
    const b = parseInt(bench);
    const d = parseInt(deadlift);

    // Validate lifts
    const validationError = validateLifts(s, b, d);
    if (validationError) {
      alert(validationError);
      return;
    }

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
      await setDoc(doc(db, "users", user.uid), data);
      // Save history
      const historyRef = collection(db, "users", user.uid, "liftHistory");
      await addDoc(historyRef, data);

      alert("Lifts updated!");
    } catch (err) {
      console.error("Error saving lifts: ", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>Squat (lbs)</label>
        <input
          type="number"
          value={squat}
          onChange={(e) => setSquat(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label>Bench (lbs)</label>
        <input
          type="number"
          value={bench}
          onChange={(e) => setBench(e.target.value)}
          className="input"
          required
        />
      </div>
      <div>
        <label>Deadlift (lbs)</label>
        <input
          type="number"
          value={deadlift}
          onChange={(e) => setDeadlift(e.target.value)}
          className="input"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
      >
        Save Lifts
      </button>
    </form>
  );
}
