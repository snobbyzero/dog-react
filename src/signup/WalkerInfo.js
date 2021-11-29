import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Box, Typography} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import axios from "axios";
import {Adjust} from "@material-ui/icons";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
    station: {
        margin: theme.spacing(1/2),
        maxWidth: "250px"
    },
    stations: {
        marginBottom: theme.spacing(2)
    }
}))
export default function WalkerInfo() {
    const classes = useStyles()

    const [stations, setStations] = useState([]);
    const [selectedStations, setSelectedStations] = useState([]);
    const [price, setPrice] = useState(10);
    const [practiceInYear, setPracticeInYear] = useState(0);
    const [minSizeDog, setMinSizeDog] = useState(0);
    const [maxSizeDog, setMaxSizeDog] = useState(1);
    const [minAgeDog, setMinAgeDog] = useState(0);
    const [maxAgeDog, setMaxAgeDog] = useState(1);
    const [schedule, setSchedule] = useState("");
    const [aboutWalker, setAboutWalker] = useState("");

    const getStations = (value, station) => {
        console.log(`station: ${station}`)
        axios.post(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/metro",
            {
                city: "Москва",
                query: value
            },
            {
                headers: {
                    "Authorization": "Token decae9911b8941c8e21ebd533d365620829cf431"
                }
            }).then(res => {
                const stations = res.data.suggestions.filter(station => selectedStations.map(st => st.data.name).indexOf(station.data.name) === -1);
                setStations(stations);
        })
    }

    return (
        <Box>
            <Typography style={{marginBottom: "20px"}}>Введите станции метро, где вы можете работать. Если неважно, оставьте полем пустым.</Typography>
            <Autocomplete
                multiple
                className={classes.stations}
                options={stations}
                getOptionLabel={option => option.data.name}
                onChange={(e, newValue) => {
                    setSelectedStations(newValue)
                }}
                renderOption={option => {
                    return (
                        <>
                        <Adjust style={{color: option.data.color}}/>
                        <Typography>{option.data.name}</Typography>
                        </>
                    )
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Станции"
                        placeholder="Введите станции"
                        onChange={(event, value) => getStations(event.target.value, value)}
                    />
                )}
                renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                        <Chip
                            avatar={<Adjust style={{color: `#${option.data.color}`}}/>}
                            label={option.data.name}
                            {...getTagProps({index})}
                            className={classes.station}
                        />
                    ))}
            />
            <Typography>Оплата (руб/час)</Typography>
            <Slider
                defaultValue={50}
                step={25}
                min={50}
                max={1500}
                value={price}
                valueLabelDisplay="on"
                onChange={(e, newValue) => setPrice(parseInt(newValue))}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="Опыт работы (в годах)"
                value={practiceInYear}
                onChange={(e) => setPracticeInYear(e.target.value)}
            />
            <Box style={{display: "flex", marginBottom: "10px"}}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    style={{marginRight: "10px"}}
                    label="Мин. возраст собаки"
                    value={minAgeDog}
                    onChange={(e) => setMinAgeDog(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    style={{marginLeft: "10px"}}
                    label="Макс. возраст собаки"
                    value={maxAgeDog}
                    onChange={(e) => setMaxAgeDog(e.target.value)}
                />
            </Box>
            <Box style={{display: "flex", marginBottom: "10px"}}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    style={{marginRight: "10px"}}
                    required
                    fullWidth
                    label="Мин. вес собаки"
                    value={minSizeDog}
                    onChange={(e) => setMinSizeDog(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Макс. вес собаки"
                    style={{marginLeft: "10px"}}
                    value={maxSizeDog}
                    onChange={(e) => setMaxSizeDog(e.target.value)}
                />
            </Box>
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                rows={10}
                multiline
                label="Опишите свое расписание"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
            />
            <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                rows={10}
                multiline
                label="Расскажите о себе"
                value={aboutWalker}
                onChange={(e) => setAboutWalker(e.target.value)}
            />
        </Box>
    )
}
