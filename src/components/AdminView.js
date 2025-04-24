import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";

export default function AdminView() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [userEmailFilter, setUserEmailFilter] = useState("");

  const fetchBookings = async () => {
    let url = "/api/bookings";
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split("T")[0];
      url += `?date=${dateStr}`;
    } else if (userEmailFilter) {
      url += `?userEmail=${userEmailFilter}`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, userEmailFilter]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setUserEmailFilter("");
  };

  const handleUserEmailFilter = (e) => {
    setUserEmailFilter(e.target.value);
    setSelectedDate(null);
  };

  const handleClearAllBookings = async () => {
    if (window.confirm("Are you sure you want to delete ALL bookings?")) {
      try {
        const response = await fetch("/api/bookings/clear", {
          method: "POST",
        });
        if (response.ok) {
          alert("All bookings cleared!");
          fetchBookings(); // Refresh the list
        } else {
          throw new Error("Failed to clear bookings");
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Mr. X's Appointment Schedule
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 3, alignItems: "center" }}>
          <DatePicker
            label="Filter by date"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            disableWeekends
          />

          <TextField
            label="Filter by user email"
            value={userEmailFilter}
            onChange={handleUserEmailFilter}
          />

          <Button
            variant="outlined"
            onClick={() => {
              setSelectedDate(null);
              setUserEmailFilter("");
              fetchBookings();
            }}
          >
            Clear Filters
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleClearAllBookings}
            sx={{ marginLeft: "auto" }}
          >
            Clear All Bookings
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>User Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking, index) => (
                <TableRow key={index}>
                  <TableCell>{booking.date}</TableCell>
                  <TableCell>{booking.time}</TableCell>
                  <TableCell>{booking.userEmail}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </LocalizationProvider>
  );
}
