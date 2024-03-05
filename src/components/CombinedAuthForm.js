import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import Head from "next/head";
import { signIn } from "next-auth/react";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
export default function CombinedAuthForm() {
  const [isRegistering, setIsRegistering] = useState(true);

  return (
    <>
      <Head>
        <title>Login or Register </title>
      </Head>
      <div className="h-screen">
       

        <div className="h-screen bg-gradient-to-r from-stone-400 to-slate-600 flex flex-col justify-center items-center">
          {isRegistering ? <RegisterForm /> : <LoginForm />}

          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="mt-1 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-transform duration-200 hover:scale-105"
          >
            {isRegistering
              ? "Already have an account? Log In"
              : "Don't have an account? Register"}
          </button>

          <div className="pt-2 pb-2 pl-3 pr-3 rounded bg-black mt-4 mb-2 flex transition-transform duration-200 hover:scale-105 text-white">
            <FcGoogle className="mr-2 mt-1" />
            <button onClick={() => signIn("google")}>
              Sign in with <span className="font-bold">Google</span>
            </button>
          </div>
          <div className="pt-2 pb-2 pl-3 pr-3 rounded bg-black flex transition-transform duration-200 hover:scale-105 text-white">
            <FaGithub className="mr-2 mt-1" />
            <button onClick={() => signIn("github")}>
              {" "}
              Sign in with <span className="font-bold">GitHub</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
