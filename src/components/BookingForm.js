import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";

export default function BookingForm({
  selectedDate,
  timeSlots,
  bookings,
  onBookSlot,
  userEmail,
  setUserEmail,
}) {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const isSlotBooked = (time) => {
    return bookings.some((booking) => booking.time === time);
  };

  const handleBookSlot = async (time) => {
    if (!userEmail) {
      setSnackbar({
        open: true,
        message: "Please enter your email",
        severity: "error",
      });
      return;
    }

    try {
      await onBookSlot(time);
      setSnackbar({
        open: true,
        message: "Booking successful!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to book slot",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="Your Email"
          variant="outlined"
          fullWidth
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          sx={{ mb: 2 }}
          required
        />
      </Box>

      {selectedDate && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Available Time Slots for {selectedDate.toDateString()}
          </Typography>

          <Grid container spacing={2}>
            {timeSlots.map((time) => (
              <Grid item xs={12} sm={6} md={3} key={time}>
                <Paper elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle1">{time}</Typography>
                  {isSlotBooked(time) ? (
                    <Typography color="error">Booked</Typography>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => handleBookSlot(time)}
                      disabled={!userEmail}
                      fullWidth
                    >
                      Book Slot
                    </Button>
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
