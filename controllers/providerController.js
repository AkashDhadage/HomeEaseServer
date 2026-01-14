import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js"; // Assuming you have a Service model
import { uploadBufferToCloudinary } from "../config/cloudinaryUpload.js";

// Get user profile
export const getProviderProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

  // Update user profile
// import User from "../models/User.js";

export const updateProviderProfile = async (req, res) => {
  try {

    // All form text fields (name, phone, address, etc.)
    const updates = { ...req.body };

    // -------------------- Upload Profile Image --------------------
    if (req.files?.image && req.files.image.length > 0) {
      const imageFile = req.files.image[0];

      const uploadedImage = await uploadBufferToCloudinary(
        imageFile.buffer,
        "provider_images"
      );

      updates.image = uploadedImage.secure_url; // Save URL only
    }

    // -------------------- Upload Documents --------------------
    if (req.files?.documents && req.files.documents.length > 0) {
      const uploadedDocs = [];

      for (const doc of req.files.documents) {
        const uploaded = await uploadBufferToCloudinary(
          doc.buffer,
          "provider_documents"
        );

        uploadedDocs.push(uploaded.secure_url);
      }

      updates.documents = uploadedDocs; // Save array of Cloudinary URLs
    }

    // -------------------- Update User in DB --------------------
    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
    });

    return res.status(200).json({
      message: "Provider profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating provider profile:", error);
    return res.status(500).json({
      message: "Error updating provider profile",
      error: error.message,
    });
  }
};


  // Get user bookings
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id })
      .populate("customer", "name  ") // Populate provider details
      .populate("service", "name price") 
      .sort({ createdAt: -1 });
      // .populate("service", "name"); // Populate service details

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get user dashboard
export const getProviderDashboard = async (req, res) => {
  try {
    const bookings = await Booking.find({ provider: req.user._id }).populate("service");
    const totalBookings = bookings.length;
    const earnings = bookings.reduce((total, booking) => total + (Number(booking.price) || 0), 0);
    const avgRating = bookings.length > 0 ? (bookings.reduce((sum, booking) => sum + (booking.rating || 0), 0) / bookings.length).toFixed(2) : "0.00";

    res.status(200).json({ totalBookings, earnings, avgRating });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data", error });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, price, rating } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const booking = await Booking.findById(id).populate("provider");
     if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.provider._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to modify this booking" });

    booking.status = status;
    if (price !== undefined) booking.price = Number(price) || booking.price;
    if (rating !== undefined) booking.rating = Number(rating) || booking.rating;

    await booking.save();
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update booking", error: error.message });
  }
};

export const rejectBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("provider");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.provider._id.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to reject this booking" });

    booking.status = "rejected"; // Set the status to rejected
    await booking.save();
    return res.status(200).json({ message: "Booking rejected successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: "Failed to reject booking", error: error.message });
  }
};