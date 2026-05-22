require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const clientRoutes = require("./routes/clientRoutes");
const pool = require("./db/db");
const videoCategoryRoutes = require("./routes/videoCategoryRoutes");
const videoRoutes = require("./routes/videoRoutes");


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/video-categories", videoCategoryRoutes);
app.use("/api/videos", videoRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Trainer business API is running" });
});


// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// DB connection
pool
  .connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch((err) => console.error("DB connection error:", err));