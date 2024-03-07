"use client";
// Home.js

import React, { useState } from "react";
import Head from "next/head";
import TodoList from "../pages";

function Home() {
  const [view, setView] = useState("login"); // Can be 'login', 'register', or 'app'



  return (
    <div>
      <Head>
        <title>Todo List App</title>
      </Head>
      <TodoList />
    </div>
  );
}

export default Home;