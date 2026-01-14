import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Service from "../models/Service.js"; // Adjust the import based on your model structure

// Get all services
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find(); // Fetch all services from the database
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Error fetching services", error });
  }
};



export const getBookedSlots = async (req, res) => {
  try {
    const providerId = req.params.id;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    // Fetch ONLY timeSlot for selected provider + date
    const bookings = await Booking.find(
      {
        provider: providerId,
        date: date
      },
      { timeSlot: 1, _id: 0 }
    );

    // Convert array of objects → ["10:00 AM", "1:30 PM"]
    const bookedSlots = bookings.map(b => b.timeSlot);

    return res.json(bookedSlots);

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};



// Get all verified providers
export const getVerifiedProviders = async (req, res) => {
  try {
    const providers = await User.find({role:'provider', isVerified: true }); // Fetch only verified providers
    res.status(200).json(providers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching verified providers", error });
  }
};

export const getCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user profile", error });
  }
};

// Create booking

export const createBooking = async (req, res) => {
  const { provider,  service, date, time,price, notes ,city,
      address,
      phone,
      zip} = req.body;
  try {
    // Check if provider and customer are valid users
    const providerExists = await User.findById(provider);
    // const customerExists = await User.findById(customer);

    if (!providerExists ) {
      return res.status(400).json({ message: "Invalid provider or customer ID." });
    }

     const dateObj = new Date(date);
    const formattedDate = dateObj.toISOString().split("T")[0];  // "2025-11-22"

    // Create a new booking
    const newBooking = new Booking({
      provider,
      customer:req.user._id,
      service,
      date:formattedDate,
      timeSlot:time,
      price,
      notes,
      city,
      address,
      phone,
      zipCode:zip,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get customer bookings
export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
    .populate("provider", "name email")
     .populate("service", "name")
     .sort({ createdAt: -1 });
      res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
