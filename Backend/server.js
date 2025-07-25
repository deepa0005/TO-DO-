const express = require("express");
const dotenv = require("dotenv");
const DB = require("./config/db");
const cors = require("cors");


dotenv.config();
DB();

const app = express();

//  CORS
app.use(cors({
  origin: "https://to-do-list-sigma-seven-51.vercel.app/",
  credentials: true,
}));


app.use(express.json());


// API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Fallback or basic status route.. optional
app.get("/", (req, res) => {
  res.send("API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
