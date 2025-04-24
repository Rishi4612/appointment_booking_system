import { clearAllBookings } from "../../../lib/bookings";

export default function handler(req, res) {
  if (req.method === "POST") {
    try {
      clearAllBookings();
      res.status(200).json({ message: "All bookings cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear bookings" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
