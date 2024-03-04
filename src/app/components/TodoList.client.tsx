"use client";
import { useState } from "react";

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [editIndex, setEditIndex] = useState(-1);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addOrUpdateTask = (e) => {
    e.preventDefault();
    if (taskInput.trim() === "") return;

    const timestamp = new Date().toISOString();

    if (editIndex > -1) {
      // Update task
      const updatedTasks = tasks.map((item, index) =>
        index === editIndex ? { ...item, text: taskInput } : item
      );
      setTasks(updatedTasks);
      setEditIndex(-1);
    } else {
      // Add new task
      setTasks([
        ...tasks,
        { text: taskInput, completed: false, createdAt: timestamp },
      ]);
    }

    setTaskInput("");
  };

  const editTask = (index) => {
    setEditIndex(index);
    setTaskInput(tasks[index].text);
  };

  const toggleCompletion = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) => {
      if (index === taskIndex) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed
            ? new Date().toISOString()
            : task.completedAt,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  // Divide tasks into completed and not completed
  const completedTasks = tasks.filter((task) => task.completed);
  const notCompletedTasks = tasks.filter((task) => !task.completed);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
      <form
        onSubmit={addOrUpdateTask}
        className="mb-4 flex flex-col items-center"
      >
        <input
          type="text"
          className="border-2 border-gray-200 rounded p-2 mr-2 w-full max-w-md"
          value={taskInput}
          onChange={handleInputChange}
          placeholder="Add a new task or update existing"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 mt-2 w-full max-w-md"
        >
          {editIndex > -1 ? "Update Task" : "Add Task"}
        </button>
      </form>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Incomplete Tasks
          </h2>
          <ul className="list-none">
            {notCompletedTasks.map((task, index) => (
              <li key={index} className="mb-2 p-2 rounded bg-red-200">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleCompletion(tasks.findIndex((t) => t === task))
                  }
                  className="mr-2"
                />

                <span>{task.text}</span>
                <span className="text-xs text-gray-600">
                  {" "}
                  (Added: {formatDate(task.createdAt)})
                </span>
                <button
                  onClick={() => editTask(index)}
                  className="text-blue-500 ml-4"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500 ml-2"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Completed Tasks
          </h2>
          <ul className="list-none">
            {completedTasks.map((task, index) => (
              <li key={index} className="mb-2 p-2 rounded bg-green-200">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    toggleCompletion(tasks.findIndex((t) => t === task))
                  }
                  className="mr-2"
                />

                <span className="line-through">{task.text}</span>
                <span className="text-xs text-gray-600">
                  {" "}
                  (Completed: {formatDate(task.completedAt)})
                </span>
                <button
                  onClick={() => deleteTask(index)}
                  className="text-red-500 ml-4"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
