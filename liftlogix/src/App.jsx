import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProgressChart from "./components/ProgressChart"; // at top
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";



import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import LiftForm from "./components/LiftForm";
import UserStats from "./components/UserStats";
import Leaderboard from "./components/Leaderboard";
import SignOutButton from "./components/SignOutButton";  // Import the SignOutButton component
import Profile from "./components/Profile";  // Import the Profile component
import EditProfile from "./components/EditProfile";







function App() {
  const [count, setCount] = useState(0)
  const [user] = useAuthState(auth);


  return (
    <Router>
      <div className="p-4 max-w-md mx-auto">
        {user ? (
          <>
            <h1 className="text-xl font-bold mb-4">Welcome, {user.displayName}</h1>
            {/* <Profile /> Display profile component */}

            <LiftForm />
            <UserStats />
            <ProgressChart /> {/* Add this */}
            <Leaderboard /> {/* Add the leaderboard component here */}
            <SignOutButton /> {/* Show the sign-out button when user is logged in */}

            {/* Define the routes for Profile and EditProfile */}
            <Routes>
              <Route path="/edit-profile" element={<EditProfile />} />
            </Routes>
          </>
        ) : (
          <Login />
        )}
      </div>
    </Router>
  )
}

export default App
