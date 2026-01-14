import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js"; // Assuming you have a Service model

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = req.body; // Get the updates from the request body
    if (req.files.image) {
      // Handle image upload
      updates.image = req.files.image[0].buffer; // Assuming you want to store the image in memory
    }
    if (req.files.documents) {
      // Handle document uploads
      updates.documents = req.files.documents.map((doc) => doc.buffer);
    }
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

// Get user bookings
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("provider", "name email service") // Populate provider details
      .populate("service", "name"); // Populate service details

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get user dashboard
export const getUserDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id }).populate("service");
    const totalBookings = bookings.length;
    const earnings = bookings.reduce((total, booking) => total + (Number(booking.price) || 0), 0);
    const avgRating = bookings.length > 0 ? (bookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / bookings.length).toFixed(2) : "0.00";

    res.status(200).json({ totalBookings, earnings, avgRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

export const acceptBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "accepted"; // Update booking status to accepted
    await booking.save();
    res.status(200).json({ message: "Booking accepted", booking });
  } catch (error) {
    res.status(500).json({ message: "Error accepting booking", error });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = "rejected"; // Update booking status to rejected
    await booking.save();
    res.status(200).json({ message: "Booking rejected", booking });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting booking", error });
  }
};