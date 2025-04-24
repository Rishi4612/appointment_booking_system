import fs from "fs";
import path from "path";

const bookingsFilePath = path.join(process.cwd(), "data", "bookings.json");

// initializing bookings file if it doesn't exist
if (!fs.existsSync(path.dirname(bookingsFilePath))) {
  fs.mkdirSync(path.dirname(bookingsFilePath));
}
if (!fs.existsSync(bookingsFilePath)) {
  fs.writeFileSync(bookingsFilePath, JSON.stringify([]));
}

export function getAllBookings() {
  const fileData = fs.readFileSync(bookingsFilePath);
  return JSON.parse(fileData);
}

export function getBookingsByDate(date) {
  const allBookings = getAllBookings();
  return allBookings.filter((booking) => booking.date === date);
}

export function addBooking(newBooking) {
  const allBookings = getAllBookings();

  // checking for already booked slots
  const isSlotTaken = allBookings.some(
    (booking) =>
      booking.date === newBooking.date && booking.time === newBooking.time
  );

  if (isSlotTaken) {
    throw new Error("This time slot is already booked");
  }

  allBookings.push(newBooking);
  fs.writeFileSync(bookingsFilePath, JSON.stringify(allBookings, null, 2));
  return newBooking;
}

export function getBookingsByUser(userEmail) {
  const allBookings = getAllBookings();
  return allBookings.filter((booking) => booking.userEmail === userEmail);
}

// additional function for clearing all booking for admin
export function clearAllBookings() {
  fs.writeFileSync(bookingsFilePath, JSON.stringify([]));
}
