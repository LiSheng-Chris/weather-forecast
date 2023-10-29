import * as React from "react";
import dayjs from "dayjs";
import "./App.css";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

function App() {
  const [date, setDate] = React.useState(dayjs(new Date()));
  const [time, setTime] = React.useState(dayjs(new Date()));

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{ pr: 2 }}
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
          <TimePicker value={time} onChange={(newValue) => setTime(newValue)} />
        </LocalizationProvider>
      </Box>
    </Container>
  );
}

export default App;
