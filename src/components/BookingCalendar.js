import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import BookingForm from "./BookingForm";

const timeSlots = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function BookingCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userEmail, setUserEmail] = useState("");

  const fetchBookings = async () => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const response = await fetch(`/api/bookings?date=${dateStr}`);
    const data = await response.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate]);

  const handleDateChange = (date) => {
    const day = date.getDay();
    if (day >= 1 && day <= 6) {
      setSelectedDate(date);
    } else {
      alert("Mr. X is only available Monday to Friday");
    }
  };

  const handleBookSlot = async (time) => {
    const dateStr = selectedDate.toISOString().split("T")[0];
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dateStr,
        time,
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    fetchBookings();
    return await response.json();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Book an Appointment with Mr. X
        </Typography>

        <DatePicker
          label="Select a date"
          value={selectedDate}
          onChange={handleDateChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth sx={{ mb: 3 }} />
          )}
          disableWeekends
          minDate={new Date()}
        />

        <BookingForm
          selectedDate={selectedDate}
          timeSlots={timeSlots}
          bookings={bookings}
          onBookSlot={handleBookSlot}
          userEmail={userEmail}
          setUserEmail={setUserEmail}
        />
      </Box>
    </LocalizationProvider>
  );
}
