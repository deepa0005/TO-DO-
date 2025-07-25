import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import TaskList from "../components/TaskList"; 
import { useAuth } from "../context/AuthContext";
const Dashboard = () => {
   const { user, loading: authLoading } = useAuth(); 
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("my-day"); 
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    if (user) fetchTasks();
  }, [user]);

  // useEffect(() => {
  //   fetchTasks();
  // }, []);

  useEffect(() => {
    filterTasksByTab();
  }, [tasks, activeTab]);

  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://to-do-kkyx.onrender.com/api/tasks");
      setTasks(response.data);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const filterTasksByTab = () => {
    // This is basic, you can enhance filtering logic later
    if (activeTab === "important") {
      setFilteredTasks(tasks.filter((task) => task.important));
    } else if (activeTab === "my-day") {
      setFilteredTasks(tasks); // Show all for now
    } else {
      setFilteredTasks(tasks); // default fallback
    }
  };

  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
<div className="flex min-h-screen bg-gradient-to-br from-blue-80 via-blue-100 to-white dark:from-blue-300 dark:via-blue-400/10 dark:to-blue-900 backdrop-blur-sm font-sans text-gray-800 dark:text-white">

      <Sidebar activeTab={activeTab} onSelect={setActiveTab} />

      <div className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4  font-sanscapitalize">
          {activeTab.replace("-", " ")}
        </h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            setTasks={setTasks}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
