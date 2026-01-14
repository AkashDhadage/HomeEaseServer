// models/Provider.js
import mongoose from "mongoose";

const providerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // connects to the user account
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
  },
  { timestamps: true }
);

export default mongoose.model("Provider", providerSchema);
