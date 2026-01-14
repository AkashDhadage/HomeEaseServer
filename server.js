import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import cors from 'cors';
dotenv.config();
const app = express();
app.use(cors({
  origin: true,  // frontend URL
  credentials: true
}));
app.use(express.json());

// Routes
app.get("/test", (req, res) => {
  res.json({ message: "Test endpoint working!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/provider", providerRoutes);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.log(err));
