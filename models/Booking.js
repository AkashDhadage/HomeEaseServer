import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    provider: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service:  { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    date: { type: String, required: true },
    timeSlot: { type: String, default:"9:00 AM" },
    price: { type: Number, default: 0 }, // numeric price for earnings calculations
    status: { type: String, enum: ["pending", "accepted", "rejected", "in_progress", "completed", "cancelled"], default: "pending" },
    rating: { type: Number, default: 0 },
    address:{type:String , required:true},
    city:{type:String ,required:true},
    zipCode:{type:String ,required:true},
    phone:{type:String,required:true},
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
