import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";


export default function CombinedAuthForm() {
  const [isRegistering, setIsRegistering] = useState(true);

  return (
    <>
    <div className="min-h-screen bg-gray-300 to-slate-600 flex flex-col justify-center items-center">
      {isRegistering ? <RegisterForm /> : <LoginForm />}

      <button
        onClick={() => setIsRegistering(!isRegistering)}
        className="mt-1 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105"
      >
        {isRegistering
          ? "Already have an account? Log In"
          : "Don't have an account? Register"}
      </button>
    </div>
    </>
  );
}