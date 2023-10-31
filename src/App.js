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
import Box from "@mui/material/Box";
import { isMobile } from "react-device-detect";

function App() {
  const [date, setDate] = useState(dayjs());
  const [time, setTime] = useState(dayjs());
  const [locationName, setLocationName] = useState("");
  const [locationList, setLocationList] = useState([]);
  const [weather, setWeather] = useState("");
  const [forecasts, setForecasts] = useState([]);
  const [trafficImage, setTrafficImage] = useState("");
  const [cameras, setCameras] = useState([]);

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
    });

    axios({
      url: "https://api.data.gov.sg/v1/transport/traffic-images",
      params: { date_time: dateTime.format() },
    }).then((res) => {
      const data = res.data;
      setCameras(data.items[0].cameras);
    });
  }, [date, time]);

  useEffect(() => {
    const location = locationList.find((l) => l.name === locationName);

    if (!location) {
      return;
    }

    const forecast = forecasts.find((f) => f.area === locationName);
    setWeather(forecast?.forecast ?? "");

    let image = "";
    let minDistance = Infinity;
    for (const camera of cameras) {
      const distance =
        (camera.location.latitude - location.label_location?.latitude) ** 2 +
        (camera.location.longitude - location.label_location?.longitude) ** 2;
      if (distance < minDistance) {
        image = camera.image ?? "";
        minDistance = distance;
      }
    }
    setTrafficImage(image);
  }, [cameras, forecasts, locationList, locationName]);

  const handleChange = (event) => {
    setLocationName(event.target.value);
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
              value={locationName}
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

        <Grid item xs={12}>
          <Box sx={{ maxWidth: 400 }} component="img" src={trafficImage} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
