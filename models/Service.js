// models/Service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true ,default:"Wrench"}, // store icon name or path
    color: { type: String },
    price: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
