import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";

const app = express();

app.use("/api", userRoutes);
app.use("/api", authRoutes);

module.exports = app;
