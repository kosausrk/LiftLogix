import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

export default function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You have been signed out.');
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
    >
      Sign out
    </button>
  );
}
