import { useState, useEffect } from "react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    displayName: "",
    squat: "",
    bench: "",
    deadlift: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    // Fetch current user data to pre-fill the form
    if (user) {
      const fetchData = async () => {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData(docSnap.data());
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    if (!user) {
      setError("User not authenticated.");
      setLoading(false);
      return;
    }
  
    const { displayName, squat, bench, deadlift } = formData;
  
    if (!displayName || !squat || !bench || !deadlift) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }
  
    try {
      const docRef = doc(db, "users", user.uid);
  
      // Log the data being saved
      console.log("Updating Firestore with:", {
        displayName,
        squat: Number(squat),
        bench: Number(bench),
        deadlift: Number(deadlift),
      });
  
      // Update Firestore
      await updateDoc(docRef, {
        displayName,
        squat: Number(squat),
        bench: Number(bench),
        deadlift: Number(deadlift),
      });
  
      // Update Firebase Auth display name
      await user.updateProfile({ displayName });
  
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  


  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Edit Profile</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="displayName" className="text-white">Name</label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            className="mt-1 p-2 w-full rounded-md"
          />
        </div>
        <div>
          <label htmlFor="squat" className="text-white">Squat (lbs)</label>
          <input
            type="number"
            id="squat"
            name="squat"
            value={formData.squat}
            onChange={handleChange}
            className="mt-1 p-2 w-full rounded-md"
          />
        </div>
        <div>
          <label htmlFor="bench" className="text-white">Bench (lbs)</label>
          <input
            type="number"
            id="bench"
            name="bench"
            value={formData.bench}
            onChange={handleChange}
            className="mt-1 p-2 w-full rounded-md"
          />
        </div>
        <div>
          <label htmlFor="deadlift" className="text-white">Deadlift (lbs)</label>
          <input
            type="number"
            id="deadlift"
            name="deadlift"
            value={formData.deadlift}
            onChange={handleChange}
            className="mt-1 p-2 w-full rounded-md"
          />
        </div>
        <button type="submit" className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>



    </div>
  );
}
