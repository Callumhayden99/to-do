'use client'
import React, { useState } from 'react';
import Head from 'next/head';
import SignUp from './SignUp';
import TodoList from './TodoList';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (email, password) => {
    // Your login logic here
    setIsAuthenticated(true);
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div>
      <Head>
        <title>To-Do List App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        !isAuthenticated ? 
        <SignUp onLogin={login} /> : 
        <TodoList onLogout={logout} />
      }
    </div>
  );
}