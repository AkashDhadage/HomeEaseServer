import express from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import { createBooking, getAllServices, getCustomerBookings, getVerifiedProviders , getCustomerProfile, getBookedSlots} from "../controllers/customerController.js";

const router = express.Router();

router.get("/services", getAllServices); // Public route to get all services
router.get("/providers", getVerifiedProviders); // Public route to get verified providers

router.get("/providers/:id/bookings", getBookedSlots);

router.get("/getCustomerProfile", protect, roleMiddleware(["customer"]), getCustomerProfile);
router.post("/bookings", protect, roleMiddleware(["customer"]), createBooking);
router.get("/bookings", protect, roleMiddleware(["customer"]), getCustomerBookings);

export default router;
