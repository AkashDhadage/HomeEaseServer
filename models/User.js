import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["customer", "provider", "admin"],
    default: "customer",
  },
    service: { type: String }, // electrician, plumber, etc.
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    price: { type: String },
    location: { type: String },
    image: { type: String,  },
    isVerified: { type: Boolean, default: false }, // admin verification status
    documents: [
      {
        fileName: String,
        fileUrl: String, // store Cloudinary or local file path
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
});

// Encrypt password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
 