import {Box, FormControl, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {Adjust} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import axios from "axios";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import {useHistory} from 'react-router-dom';
import {getAccessToken} from "../utils/auth";
import SendDialog from "./SendDialog";

const useStyles = makeStyles((theme) => ({
    side: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    filters: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: theme.spacing(2)
    },
    stations: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: "300px"
    },
    selectDog: {
        margin: theme.spacing(2),
        marginLeft: theme.spacing(2),
        width: "300px"
    },
    station: {
        margin: theme.spacing(1 / 2)
    },
    walkers_box: {
        display: "flex",
        flexGrow: 1,
        flexFlow: "row wrap"
    },
    searchButton: {
        margin: theme.spacing(2),
        width: "250px",
        height: "45px"
    },
    walkerImage: {
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        cursor: "pointer",
        margin: theme.spacing(1)
    },
    walker: {
        display: "flex",
        width: "370px",
        maxHeight: "250px",
        margin: theme.spacing(1),
        marginTop: theme.spacing(2),

    },
    walkerInfo: {
        display: "flex",
        flexDirection: "column",
        margin: theme.spacing(1),
        marginBottom: theme.spacing(0)
    },
    sendButton: {
        margin: theme.spacing(1),
        marginBottom: theme.spacing(2),
        width: "200px",
        height: "45px"
    },
    sortPaper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        margin: theme.spacing(2)
    }
}));
export default function Home() {
    const classes = useStyles();

    const [stations, setStations] = useState([]);
    const [selectedStations, setSelectedStations] = useState([]);
    const [walkers, setWalkers] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [open, setOpen] = useState(false);
    const history = useHistory();

    useEffect(() => {
        const getDogs = async() => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/dog/all", {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    setDogs(res.data);
                })
        }
        getDogs()

    })

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

    const goToProfile = (walker) => {
        history.push("/profile/" + walker.id)
    }

    const sendButtonClick = (walker) => {

    }

    return (
        <Box style={{display: "flex", alignItems: "flex-start"}}>
            <Box className={classes.walkers_box}>
                {
                    [0, 1, 2, 3, 4, 5].map(walker => (
                        <Paper className={classes.walker}>
                            <img src="https://upload.wikimedia.org/wikipedia/ru/thumb/4/4d/Wojak.png/200px-Wojak.png"
                                 className={classes.walkerImage} onClick={e => goToProfile(walker)}/>
                            <Box style={{justifyContent: "space-between"}}>
                                <Box className={classes.walkerInfo}>
                                    <Typography variant="h6" style={{
                                        overflow: "hidden",
                                        whiteSpace: "wrap",
                                        textOverflow: "ellipsis",
                                        cursor: "pointer"
                                    }} onClick={e => goToProfile(walker)}>Иванов Иван Иванович</Typography>
                                    <Typography style={{
                                        display: "-webkit-box",
                                        "-webkit-line-clamp": "3",
                                        "-webkit-box-orient": "vertical",
                                        overflow: "hidden"
                                    }}>Работаю с понедельника по среду 9:00-15:00</Typography>
                                    <Typography variant="h6" color="secondary">500 руб. / час</Typography>
                                </Box>
                                <Button onClick={sendButtonClick} className={classes.sendButton} color="secondary" variant="outlined">Отправить
                                    заявку</Button>
                            </Box>
                            <SendDialog open={open} setOpen={setOpen} id={walker.id}/>
                        </Paper>
                    ))
                }
            </Box>
            <Box>
                <Paper className={classes.sortPaper}>
                    <Typography variant="h5">Сортировка</Typography>
                    <FormControl variant="outlined" className={classes.selectDog}>
                        <InputLabel>Сортировать по</InputLabel>
                        <Select label="Сортировать по">
                            <MenuItem value={10}>Дешевле</MenuItem>
                            <MenuItem value={20}>Дороже</MenuItem>
                            <MenuItem value={30}>Больше стаж</MenuItem>
                            <MenuItem value={30}>Меньше стаж</MenuItem>
                        </Select>
                    </FormControl>
                </Paper>
                <Paper className={classes.filters}>
                    <Typography variant="h5">Фильтры</Typography>
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
                    <FormControl variant="outlined" className={classes.selectDog}>
                        <InputLabel>Собака</InputLabel>
                        <Select label="Собака"/>
                    </FormControl>
                    <Button variant="contained" color="primary" className={classes.searchButton}>
                        Найти
                    </Button>
                </Paper>
            </Box>
        </Box>
    );
}
