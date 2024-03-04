'use client'
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [editIndex, setEditIndex] = useState(-1);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const handleDateChange = (date) => {
    setTaskDate(date);
  };

  const formatDateForComparison = (date) => {
    return date.toISOString().split('T')[0];
  };

  const addOrUpdateTask = (e) => {
    e.preventDefault();
    if (taskInput.trim() === "") return;

    const dateStr = formatDateForComparison(taskDate);
    const id = editIndex > -1 ? tasks[editIndex].id : Date.now().toString();
    const newTask = {
      id,
      text: taskInput,
      completed: false,
      createdAt: new Date().toISOString(),
      date: dateStr,
    };

    if (editIndex > -1) {
      const updatedTasks = tasks.map(task => task.id === id ? newTask : task);
      setTasks(updatedTasks);
    } else {
      setTasks([...tasks, newTask]);
    }

    setEditIndex(-1);
    setTaskInput("");
    setTaskDate(new Date());
  };

  const toggleCompletion = (taskId) => {
    const updatedTasks = tasks.map(task => task.id === taskId ? { ...task, completed: !task.completed } : task);
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const groupedTasks = tasks.reduce((acc, task) => {
    const date = task.date || formatDateForComparison(new Date());
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-200">
      <div className="container mx-auto p-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Task Scheduler</h1>
        <form onSubmit={addOrUpdateTask} className="mb-4 flex flex-col items-center">
          <input
            type="text"
            className="border-2 border-gray-300 rounded p-2 mb-2 w-full max-w-md"
            value={taskInput}
            onChange={handleInputChange}
            placeholder="Add New Task"
          />
          <DatePicker
            selected={taskDate}
            onChange={handleDateChange}
            className="border-2 border-gray-300 rounded p-2 mb-2 w-full max-w-md"
          />
          <button type="submit" className="bg-blue-500 text-white rounded p-2 w-full max-w-md">
            {editIndex > -1 ? 'Update Task' : 'Add Task'}
          </button>
        </form>

        {Object.keys(groupedTasks).sort().map((date) => (
          <div key={date} className="mb-4">
            <h2 className="text-lg font-semibold">{date}</h2>
            <ul>
              {groupedTasks[date].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((task) => (
                <li key={task.id} className={`p-2 rounded shadow mb-2 flex justify-between items-center ${task.completed ? 'bg-green-200' : 'bg-red-200'}`}>
                  <span className={task.completed ? 'line-through' : ''}>{task.text}</span>
                  <div>
                    <button onClick={() => toggleCompletion(task.id)} className="bg-blue-500 text-white p-1 rounded mr-2">Toggle</button>
                    <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
