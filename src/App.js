import dayjs from "dayjs";
import "./App.css";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { useState, useEffect } from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { isMobile } from "react-device-detect";

function App() {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [location, setLocation] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [weather, setWeather] = useState("");
  const [forecasts, setForecasts] = useState([]);

  useEffect(() => {
    const dateTime = dayjs()
      .set("year", date.get("year"))
      .set("month", date.get("month"))
      .set("date", date.get("date"))
      .set("hour", time.get("hour"))
      .set("minute", time.get("minute"))
      .set("second", time.get("second"));

    axios({
      url: "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast",
      params: { date_time: dateTime.format() },
    }).then((res) => {
      const data = res.data;
      setLocationList(data.area_metadata);
      setForecasts(data.items[0].forecasts);
      if (locationList.length) {
        setLocation(locationList[0].name);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);

  useEffect(() => {
    const forecast = forecasts.find((f) => f.area === location);
    if (forecast) {
      setWeather(forecast.forecast);
    }
  }, [location, forecasts]);

  const handleChange = (event) => {
    setLocation(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} sx={{ mt: 8 }} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid item xs={4}>
            <DatePicker value={date} onChange={(val) => setDate(val)} />
          </Grid>
          <Grid item xs={4}>
            <TimePicker value={time} onChange={(val) => setTime(val)} />
          </Grid>
        </LocalizationProvider>

        <Grid item xs={8}>
          <FormControl fullWidth>
            <InputLabel id="location-label">Location</InputLabel>
            <Select
              labelId="location-label"
              value={location}
              onChange={handleChange}
              fullWidth
            >
              {locationList.map((l, i) => (
                <MenuItem value={l.name} key={i}>
                  {l.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={isMobile ? 8 : 4}>
          {weather}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
