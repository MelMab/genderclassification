const express = require("express");
const cors = require("./middleware/cors");
const classifyRouter = require("./routes/classifyRoute");

const app = express();

app.use(express.json());


app.use(cors);

// Routes
app.use("/api", classifyRouter);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("[Unhandled Error]", err);
  res.status(500).json({ status: "error", message: "Internal server error" });
});

module.exports = app;