import dotenv from "dotenv";
dotenv.config();

import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary

if (!process.env.CLOUD_NAME || !process.env.API_KEY || !process.env.API_SECRET) {
  console.error("Missing Cloudinary environment variables.");
  process.exit(1); // Exit the app if variables are missing
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


export default cloudinary;

