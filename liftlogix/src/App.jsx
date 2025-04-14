import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import Login from "./components/Login";
import LiftForm from "./components/LiftForm";
import UserStats from "./components/UserStats";





function App() {
  const [count, setCount] = useState(0)
  const [user] = useAuthState(auth);


  return (
    <div className="p-4 max-w-md mx-auto">
    {user ? (
      <>
        <h1 className="text-xl font-bold mb-4">Welcome, {user.displayName}</h1>
        <LiftForm />
        <UserStats />
      </>
    ) : (
      <Login />
    )}
  </div>

  )
}

export default App
