"use client";
import { useState } from "react";
import Registration from "./Registration";

type SignUpProps = {
  onLogin: (email: string, password: string) => void;
};

export default function SignUp({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  const handleRegister = (email, password) => {
    console.log("Registering", email, password);
    setIsRegistering(false); 
  };

  if (isRegistering) {
    return (
      <>
        <Registration onRegister={handleRegister} />
        <button
          onClick={() => setIsRegistering(false)}
          className="mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700 focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
        >
          Back to Login
        </button>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <div className="max-w-md w-full mx-auto">
          <div className="bg-white p-8 border border-gray-300 rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Log In
                </button>
                <div className="mt-6 text-center">
                  <button
                    onClick={() => setIsRegistering(true)}
                    className="text-blue-500 hover:text-blue-700 font-semibold"
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
function onLogin(email: string, password: string) {
  throw new Error("Function not implemented.");
}
