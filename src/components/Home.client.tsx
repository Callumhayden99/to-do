"use client";
// Home.js

import React, { useState } from "react";
import Head from "next/head";
import TodoList from "../pages";

function Home() {
  const [view, setView] = useState("login"); // Can be 'login', 'register', or 'app'

  const handleLogin = (email, password) => {
    // Implement login logic here
    setView("app"); // For now, immediately switch to app view on login attempt
  };

  const handleLogout = () => {
    setView("login"); // Show login view on logout
  };

  return (
    <div>
      <Head>
        <title>Todo List App</title>
      </Head>
      <TodoList onLogout={undefined} />
    </div>
  );
}

export default Home;
