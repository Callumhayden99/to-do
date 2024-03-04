import React from "react";

export default function Main() {
    return (
      <>
        <section className="flex flex-row justify-center gap-5 bg-gray-500 h-screen text-center ">
          <div className="bg-red-500 text-white w-96"> 
            <h1 className="text-4xl">To-Do</h1>
          </div>
  
          <div className="bg-green-500 text-white w-96">
            <h1 className="text-4xl">Completed To-Do's</h1>
          </div>
        </section>
      </>
    );
  }
  