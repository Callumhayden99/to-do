'use client'
import { useState } from 'react';

export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState('');
  const [editIndex, setEditIndex] = useState(-1);

  const handleInputChange = (e) => {
    setTaskInput(e.target.value);
  };

  const addOrUpdateTask = (e) => {
    e.preventDefault();
    if (taskInput.trim() === '') return;

    if (editIndex > -1) {
      const updatedTasks = tasks.map((item, index) =>
        index === editIndex ? { ...item, text: taskInput } : item
      );
      setTasks(updatedTasks);
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: taskInput, completed: false }]);
    }

    setTaskInput('');
  };

  const editTask = (index) => {
    setEditIndex(index);
    setTaskInput(tasks[index].text);
  };

  const toggleCompletion = (index) => {
    const updatedTasks = tasks.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );
    setTasks(updatedTasks);
  };

  const deleteTask = (index) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">To-Do List</h1>
      <form onSubmit={addOrUpdateTask} className="mb-4">
        <input
          type="text"
          className="border-2 border-gray-200 rounded p-2 mr-2"
          value={taskInput}
          onChange={handleInputChange}
          placeholder="Add a new task or update existing"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2"
        >
          {editIndex > -1 ? 'Update Task' : 'Add Task'}
        </button>
      </form>
      <ul className="list-none">
        {tasks.map((task, index) => (
          <li key={index} className={`mb-2 p-2 rounded ${task.completed ? 'bg-green-200' : 'bg-gray-200'}`}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompletion(index)}
              className="mr-2"
            />
            <span className={task.completed ? 'line-through' : undefined}>
              {task.text}
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
  );
}
