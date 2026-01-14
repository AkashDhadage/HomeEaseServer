import express from "express";
import multer from "multer";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getProviderProfile,
  updateProviderProfile,
  getProviderBookings,
  getProviderDashboard,
  updateBookingStatus,
  rejectBooking,
} from "../controllers/providerController.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
router.get("/profile", protect, getProviderProfile);

// Allow image + multiple documents
router.put(
  "/profile",
  protect,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "documents", maxCount: 5 },
  ]),
  updateProviderProfile
);

router.get("/bookings", protect, roleMiddleware(["provider"]), getProviderBookings);
router.get("/dashboard", protect, roleMiddleware(["provider"]), getProviderDashboard);
router.put("/bookings/:id/status", protect, updateBookingStatus);
router.put("/bookings/:id/reject", protect, rejectBooking);

export default router;
