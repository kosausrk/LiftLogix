import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ProgressChart from "./components/ProgressChart"; // at top


import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import LiftForm from "./components/LiftForm";
import UserStats from "./components/UserStats";
import Leaderboard from "./components/Leaderboard";
import SignOutButton from "./components/SignOutButton";  // Import the SignOutButton component
import Profile from "./components/Profile";  // Import the Profile component







function App() {
  const [count, setCount] = useState(0)
  const [user] = useAuthState(auth);


  return (
    <div className="p-4 max-w-md mx-auto">
    {user ? (
      <>
        <h1 className="text-xl font-bold mb-4">Welcome, {user.displayName}</h1>
        <Profile />  {/* Add the Profile component here */}

        <LiftForm />
        <UserStats />
        <ProgressChart /> {/* Add this */}
        <Leaderboard /> {/* Add the leaderboard component here */}
        <SignOutButton />  {/* Show the sign-out button when user is logged in */}


      </>
    ) : (
      <Login />
    )}
  </div>

  )
}

export default App
