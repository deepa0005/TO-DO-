const express = require("express");
const dotenv = require("dotenv");
const DB = require("./config/db");
const cors = require("cors"); 

dotenv.config();
DB();

const app = express();

app.use(cors({
  origin: "https://to-do-list-sigma-seven-51.vercel.app",
  credentials: true,
}));

app.use(express.json()); // to parse JSON requests

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
