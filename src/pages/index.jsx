"use client";
import React, { useState, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import { getSession } from "next-auth/react";
import "react-datepicker/dist/react-datepicker.css";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

export default function TodoList() {
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e) => setTaskInput(e.target.value);

  const handleDateChange = (date) => setTaskDate(date);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const addOrUpdateTask = (e) => {
    e.preventDefault();
    const formattedDate = formatDate(taskDate);

    const newTask = {
      id: editIndex !== null ? tasks[editIndex].id : Date.now(),
      text: taskInput,
      date: formattedDate,
      createdAt: new Date().toISOString(),
      completed: editIndex !== null ? tasks[editIndex].completed : false,
      completedAt: editIndex !== null ? tasks[editIndex].completedAt : "",
    };

    if (editIndex !== null) {
      const updatedTasks = tasks.map((task, index) =>
        index === editIndex ? newTask : task
      );
      setTasks(updatedTasks);
      setEditIndex(null);
    } else {
      setTasks([...tasks, newTask]);
    }

    setTaskInput("");
    setTaskDate(new Date());
  };

  const toggleCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            completed: !task.completed,
            completedAt: !task.completed
              ? new Date().toISOString()
              : task.completedAt,
          }
        : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (index) => {
    setEditIndex(index);
    setTaskInput(tasks[index].text);
    setTaskDate(new Date(tasks[index].date));
  };

  const tasksGroupedByDate = useMemo(() => {
    return tasks.reduce((acc, task) => {
      (acc[task.date] = acc[task.date] || []).push(task);
      return acc;
    }, {});
  }, [tasks]);

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  useEffect(() => {
    Notification.requestPermission().then((result) => {
      if (result === "granted") {
        const today = new Date().toISOString().split("T")[0];
        const todaysTasks = tasks.filter((task) => task.date === today);

        if (todaysTasks.length > 0) {
          new Notification("Task Reminder", {
            body: `You have ${todaysTasks.length} tasks due today.`,
          });
        }
      }
    });
  }, [tasks]);


  const router = useRouter();
  useEffect(() => {
    // Redirect unauthenticated users
    if (status !== 'loading' && !session) {
      router.push('/auth');
    }
  }, [session, status, router]);

  return (
    <div className="min-h-screen bg-gray-200 p-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center">
        Task Scheduler
      </h1>
      <form
        onSubmit={addOrUpdateTask}
        className="mb-4 flex flex-col items-center space-y-2"
      >
        <input
          type="text"
          value={taskInput}
          onChange={handleInputChange}
          placeholder="Task Description"
          className="border-2 border-gray-300 rounded p-2 w-full max-w-md"
        />
        <DatePicker
          selected={taskDate}
          onChange={handleDateChange}
          dateFormat="yyyy/MM/dd"
          className="border-2 border-gray-300 rounded p-2 w-full max-w-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 w-full max-w-md"
        >
          {editIndex !== null ? "Update Task" : "Add Task"}
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "/auth" })}// Use the onLogout function when the button is clicked
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </form>
      {Object.entries(tasksGroupedByDate)
        .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
        .map(([date, tasksForDate]) => (
          <div key={date} className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
              {new Date(date).toLocaleDateString()}
            </h2>
            <ul className="space-y-2">
              {tasksForDate.map((task) => (
                <li
                  key={task.id}
                  className={`p-2 rounded shadow flex flex-col sm:flex-row justify-between items-center ${
                    task.completed ? "bg-green-200" : "bg-red-200"
                  }`}
                >
                  <div className="flex-1">
                    <p
                      className={`${
                        task.completed ? "line-through" : ""
                      } text-sm sm:text-base`}
                    >
                      {task.text}
                    </p>
                    <p className="text-xs text-gray-600">
                      Added: {new Date(task.createdAt).toLocaleString()}
                      {task.completed &&
                        `, Completed: ${new Date(
                          task.completedAt
                        ).toLocaleString()}`}
                    </p>
                  </div>
                  <div className="flex space-x-1 mt-2 sm:mt-0">
                    <button
                      onClick={() => toggleCompletion(task.id)}
                      className="bg-blue-500 text-white p-1 rounded text-xs sm:text-sm"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() =>
                        editTask(tasks.findIndex((t) => t.id === task.id))
                      }
                      className="bg-yellow-500 text-white p-1 rounded text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 text-white p-1 rounded text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}