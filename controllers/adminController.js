import User from "../models/User.js";
import Service from "../models/Service.js";

// Get all users with pagination and search
export const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;
  try {
    const users = await User.find({ role: "customer", name: { $regex: search, $options: "i" } })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await User.countDocuments({ role: "customer", name: { $regex: search, $options: "i" } });
    res.status(200).json({ users, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};

// Block or unblock user
export const toggleUserStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "user") return res.status(404).json({ message: "User not found" });
    user.isBlocked = !user.isBlocked; // Toggle block status
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Failed to update user status", error: error.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user || user.role !== "user") return res.status(404).json({ message: "User not found" });
    await User.findByIdAndDelete(userId);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error: error.message });
  }
};

// Get all service providers with pagination and filters
export const getAllServiceProviders = async (req, res) => {
  const { page = 1, limit = 10, verified } = req.query;
  try {
    const filters = { role: "provider" };
    if (verified) filters.isVerified = verified === "true";

    const serviceProviders = await User.find(filters)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await User.countDocuments(filters);
    res.status(200).json({ serviceProviders, totalPages: Math.ceil(count / limit), currentPage: page });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service providers", error: error.message });
  }
};

// Verify or reject service provider
export const toggleProviderVerification = async (req, res) => {
  const { providerId } = req.params;
  try {
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== "provider") return res.status(404).json({ message: "Provider not found" });
    provider.isVerified = !provider.isVerified; // Toggle verification status
    await provider.save();
    res.status(200).json(provider);
  } catch (error) {
    res.status(500).json({ message: "Failed to update provider status", error: error.message });
  }
};

// Delete service provider
export const deleteServiceProvider = async (req, res) => {
  const { providerId } = req.params;
  try {
    const provider = await User.findById(providerId);
    if (!provider || provider.role !== "provider") return res.status(404).json({ message: "Provider not found" });
    await User.findByIdAndDelete(providerId);
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: "Failed to delete provider", error: error.message });
  }
};

// ➕ Create a new service (Admin or Provider)
export const createService = async (req, res) => {
  try {
    const { name, icon, color, price, description } = req.body;

    const service = new Service({
      name,
      icon,
      color,
      price,
      description,
      createdBy: req.user._id,
    });

    await service.save();
    res.status(201).json({ message: "Service created successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Failed to create service", error: error.message });
  }
};

// 📜 Get all services (Public)
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch services", error: error.message });
  }
};

// 🔍 Get single service by ID
export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch service", error: error.message });
  }
};

// ✏️ Update a service (Admin or Provider)
export const updateService = async (req, res) => {
  try {
    const { name, icon, color, price, description } = req.body;
    const service = await Service.findById(req.params.id);

    if (!service) return res.status(404).json({ message: "Service not found" });

    service.name = name || service.name;
    service.icon = icon || service.icon;
    service.color = color || service.color;
    service.price = price || service.price;
    service.description = description || service.description;

    await service.save();
    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ message: "Failed to update service", error: error.message });
  }
};

// ❌ Delete a service (Admin or Provider)
export const deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete service", error: error.message });
  }
};

