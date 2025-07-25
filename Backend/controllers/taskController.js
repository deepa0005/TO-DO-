const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id });
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description } = req.body;
  const task = await Task.create({ title, description, user: req.user._id });
  res.status(201).json(task);
};

//update task and marked as completed
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) return res.status(404).json({ message: "Task not found" });

  
    const { title, completed, important } = req.body;

    if (title !== undefined) task.title = title;
    if (completed !== undefined) task.completed = completed;

    
    if (important !== undefined) {
      task.important = important;
      task.dateMarkedImportant = important ? new Date() : null;
    }

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error" });
  }
};



exports.deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!task) return res.status(404).json({ message: "Task not found" });

  res.json({ message: "Task deleted" });
};
