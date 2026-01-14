import express from "express";
import { protect, roleMiddleware } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  toggleUserStatus,
  deleteUser,
  getAllServiceProviders,
  toggleProviderVerification,
  deleteServiceProvider,
  createService,
  getAllServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/adminController.js";

const router = express.Router();

// User Management Routes
router.get("/users", protect, roleMiddleware(["admin"]), getAllUsers);
router.put("/users/:userId/status", protect, roleMiddleware(["admin"]), toggleUserStatus);
router.delete("/users/:userId", protect, roleMiddleware(["admin"]), deleteUser);

// Service Provider Management Routes
router.get("/service-providers", protect, roleMiddleware(["admin"]), getAllServiceProviders);
router.put("/service-providers/:providerId/verify", protect, roleMiddleware(["admin"]), toggleProviderVerification);
router.delete("/service-providers/:providerId", protect, roleMiddleware(["admin"]), deleteServiceProvider);

// Service Management Routes
router.post("/services", protect, roleMiddleware(["admin"]), createService);
router.get("/services", protect, roleMiddleware(["admin"]), getAllServices);
router.get("/services/:id", protect, roleMiddleware(["admin"]), getServiceById);
router.put("/services/:id", protect, roleMiddleware(["admin"]), updateService);
router.delete("/services/:id", protect, roleMiddleware(["admin"]), deleteService);

export default router;
