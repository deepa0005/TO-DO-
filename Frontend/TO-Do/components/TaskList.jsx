import React, { useState } from "react";
import { Plus, Trash2, Edit2, Check, X, Star } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskList = ({ tasks, setTasks }) => {
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [addingTask, setAddingTask] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            setAddingTask(true);
            const res = await axios.post("http://localhost:5000/api/tasks", {
                title: newTaskTitle.trim(),
                important: false, // default
            });
            setTasks((prev) => [res.data, ...prev]);
            setNewTaskTitle("");
            toast.success("Task added!");
        } catch {
            toast.error("Failed to add task");
        } finally {
            setAddingTask(false);
        }
    };

    const deleteTask = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`);
            setTasks((prev) => prev.filter((t) => t._id !== id));
            toast.success("Deleted!");
        } catch {
            toast.error("Failed to delete");
        }
    };

    const toggleComplete = async (id, completed) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
                completed,
            });
            setTasks((prev) =>
                prev.map((t) => (t._id === id ? { ...t, completed: res.data.completed } : t))
            );
        } catch {
            toast.error("Failed to update");
        }
    };

    const toggleImportant = async (id, currentValue) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
                important: !currentValue,
            });
            setTasks((prev) =>
                prev.map((t) => (t._id === id ? { ...t, important: res.data.important } : t))
            );
            toast.success(`Marked as ${!currentValue ? "important" : "normal"}`);
        } catch {
            toast.error("Failed to update importance");
        }
    };

    const startEdit = (task) => {
        setEditingTask(task._id);
        setEditTitle(task.title);
    };

    const saveEdit = async (id) => {
        if (!editTitle.trim()) return toast.error("Empty title");
        try {
            const res = await axios.put(`http://localhost:5000/api/tasks/${id}`, {
                title: editTitle.trim(),
            });
            setTasks((prev) =>
                prev.map((t) => (t._id === id ? { ...t, title: res.data.title } : t))
            );
            setEditingTask(null);
            setEditTitle("");
            toast.success("Updated");
        } catch {
            toast.error("Failed");
        }
    };

    const cancelEdit = () => {
        setEditingTask(null);
        setEditTitle("");
    };

    return (
        <div className="p-6 rounded-lg bg-pink-100/40 dark:bg-pink-200/10">
            {/* Add Task */}
            <form onSubmit={addTask} className="flex gap-2 mb-6">
                <input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-2 rounded border border-pink-400 bg-white text-gray-800 placeholder-pink-400 dark:shadow-black/40  focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-white dark:text-gray-900 shadow-md dark:border-gray-600"

                />

                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                    disabled={!newTaskTitle.trim() || addingTask}
                >
                    <Plus size={16} />
                </button>
            </form>

            {/* Tasks */}
            <div className="space-y-3">
                {tasks.length === 0 ? (
                    <div className="text-pink-400 text-center py-6">✨ Focus on your day</div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task._id}
                            className={`flex items-center gap-3 p-3 rounded border border-pink-300 backdrop-blur-md shadow-md
    ${
      task.completed
        ? "bg-green-100 dark:bg-green-900/20 line-through text-gray-500"
        : "bg-white/90 shadow-pink-200 dark:bg-white/10 dark:shadow-black/40 text-gray-800 dark:text-white"
    }`}
                        >
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={(e) => toggleComplete(task._id, e.target.checked)}
                            />

                            {editingTask === task._id ? (
                                <>
                                    <input
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="flex-1 px-2 py-1 rounded border dark:bg-gray-800 dark:text-white"
                                    />
                                    <button onClick={() => saveEdit(task._id)} className="text-green-600">
                                        <Check size={16} />
                                    </button>
                                    <button onClick={cancelEdit} className="text-red-600">
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1">{task.title}</span>

                                    {/* Mark Important */}
                                    <button
                                        onClick={() => toggleImportant(task._id, task.important)}
                                        className={`${task.important ? "text-yellow-400" : "text-gray-400"
                                            } hover:text-yellow-500`}
                                    >
                                        <Star fill={task.important ? "currentColor" : "none"} size={18} />
                                    </button>

                                    <button onClick={() => startEdit(task)} className="text-blue-500">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteTask(task._id)} className="text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default TaskList;
