import {
  getAllBookings,
  getBookingsByDate,
  addBooking,
  getBookingsByUser,
} from "../../lib/bookings";

export default function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { date, userEmail } = req.query;

      if (date) {
        const bookings = getBookingsByDate(date);
        return res.status(200).json(bookings);
      }

      if (userEmail) {
        const bookings = getBookingsByUser(userEmail);
        return res.status(200).json(bookings);
      }

      const bookings = getAllBookings();
      return res.status(200).json(bookings);
    }

    if (req.method === "POST") {
      const newBooking = req.body;
      const createdBooking = addBooking(newBooking);
      return res.status(201).json(createdBooking);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
