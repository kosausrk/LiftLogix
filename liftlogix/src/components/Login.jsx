import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";

export default function Login() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
    >
      Sign in with Google
    </button>
  );
}
