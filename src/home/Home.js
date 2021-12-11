import {Box, FormControl, Typography} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import Paper from "@material-ui/core/Paper";
import {Adjust, Star} from "@material-ui/icons";
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
        flexFlow: "row wrap",
        justifyContent: "start"
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
        width: "700px",
        padding: theme.spacing(1),
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
    const [selectedWalkers, setSelectedWalkers] = useState([]);
    const [dogs, setDogs] = useState([]);
    const [dog, setDog] = useState();
    const [open, setOpen] = useState(false);
    const [id, setId] = useState();
    const [sortWalkers, setSortWalkers] = useState(0)
    const history = useHistory();

    const getColor = async (station) => {
        const res = await axios.post(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/metro",
            {
                city: "Москва",
                query: station
            },
            {
                headers: {
                    "Authorization": "Token decae9911b8941c8e21ebd533d365620829cf431"
                }
            })
        if (res.data.suggestions && res.data.suggestions.length > 0) {
            return "#" + res.data.suggestions[0].data.color
        } else {
            return "white"
        }
    }

    useEffect(() => {
        const getDogs = async () => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/dog/all", {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    setDogs(res.data);
                })
        }
        const getWalkers = async () => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/walker/all")
                .then(async res => {
                    await Promise.all(res.data.map(async user => {
                        user.Walker.stations = await Promise.all(user.Walker.stations.map(async station => {
                            return {value: station, color: await getColor(station)};
                        }))
                    }))
                    setWalkers(res.data)
                    setSelectedWalkers(res.data);
                    console.log(res.data)
                })
        }
        getWalkers()
        getDogs()

    }, [])

    const sort = () => {
        console.log(sortWalkers);
        const arr = [...selectedWalkers];
        if (sortWalkers === 0) {
            setSelectedWalkers(arr.sort((w1, w2) => w1.Walker.price_per_hour - w2.Walker.price_per_hour))
        } else if (sortWalkers === 1) {
            setSelectedWalkers(arr.sort((w1, w2) => w2.Walker.price_per_hour - w1.Walker.price_per_hour))
        } else if (sortWalkers === 2) {
            setSelectedWalkers(arr.sort((w1, w2) => w1.Walker.client_order_count - w2.Walker.client_order_count))
        } else if (sortWalkers === 3) {
            setSelectedWalkers(arr.sort((w1, w2) => w2.Walker.client_order_count - w1.Walker.client_order_count))
        } else if (sortWalkers === 4) {
            setSelectedWalkers(arr.sort((w1, w2) => w1.Walker.rating - w2.Walker.rating))
        } else {
            setSelectedWalkers(walkers);
        }
        console.log(selectedWalkers)
    }

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

    const goToProfile = (id) => {
        history.push("/profile/" + id)
    }

    const sendButtonClick = (id) => {
        setOpen(true)
        setId(id)
        console.log(id);
    }

    const searchButtonClick = () => {
        let arr = [...walkers]
        console.log(selectedStations)
        console.log(walkers[0].Walker.stations)
        if (selectedStations.length > 0) {
            arr = arr.filter(walker => {
                if (walker.Walker.stations.length === 0) {
                    return true;
                }
                for (let i = 0; i < walker.Walker.stations.length; i++) {
                    console.log(selectedStations.map(st => st.value))
                    console.log(walker.Walker.stations[i].value)
                    if (selectedStations.map(st => st.value).indexOf(walker.Walker.stations[i].value) >= 0) {
                        console.log(true)
                        return true;
                    }
                }
                console.log(false)
                return false;
            })
            console.log("stations filter")
            console.log(arr);
        }
        if (dog) {
            console.log(dog);
            console.log(new Date().getYear() - new Date(dog.date_of_birth).getYear())
            arr = arr.filter(walker => walker.Walker.min_dog_size_in_kg <= dog.size_in_kg)
            arr = arr.filter(walker => walker.Walker.max_dog_size_in_kg >= dog.size_in_kg)
            arr = arr.filter(walker => walker.Walker.min_dog_age_in_years <= new Date().getYear() - new Date(dog.date_of_birth).getYear())
            arr = arr.filter(walker => walker.Walker.min_dog_age_in_years >= new Date().getYear() - new Date(dog.date_of_birth).getYear())
        }
        setSelectedWalkers(arr);
    }

    return (
        <Box
            style={{display: "flex", alignItems: "flex-start", width: "90vw", marginRight: "auto", marginLeft: "auto"}}>
            <SendDialog open={open} setOpen={setOpen} id={id}/>
            <Box style={{position: "sticky", top: 0}}>
                <Paper className={classes.sortPaper}>
                    <Typography variant="h5">Сортировка</Typography>
                    <FormControl variant="outlined" className={classes.selectDog}>
                        <InputLabel>Сортировать по</InputLabel>
                        <Select label="Сортировать по" value={sortWalkers} onChange={e => setSortWalkers(e.target.value)}>
                            <MenuItem value={0}>Сначала дешевые</MenuItem>
                            <MenuItem value={1}>Сначала дорогие</MenuItem>
                            <MenuItem value={2}>Сначала популярные</MenuItem>
                            <MenuItem value={3}>Сначала не популярные</MenuItem>
                            <MenuItem value={4}>По рейтингу</MenuItem>
                            <MenuItem value={5}>Рекомендуем</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={() => sort()}
                            className={classes.searchButton}>
                        Сортировать
                    </Button>
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
                        <Select label="Собака" value={dog} onChange={e => {setDog(e.target.value)}}>
                            {
                                dogs.map(dog => (
                                    <MenuItem value={dog}>{dog.nickname}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={searchButtonClick}
                            className={classes.searchButton}>
                        Найти
                    </Button>
                </Paper>
            </Box>
            <Box className={classes.walkers_box}>
                {
                    selectedWalkers.map(walker => (
                        <Paper className={classes.walker}>
                            <img src="https://upload.wikimedia.org/wikipedia/ru/thumb/4/4d/Wojak.png/200px-Wojak.png"
                                 className={classes.walkerImage} onClick={e => goToProfile(walker.User.id)}/>
                                 <Box style={{display: "flex", flexDirection: "column", flexGrow: 1}}>
                            <Box style={{display: "flex", justifyContent: "space-between"}}>
                                <Box style={{justifyContent: "space-between"}}>
                                    <Box className={classes.walkerInfo}>
                                        <Box style={{display: "flex", alignItems: "center"}}>
                                            <Box style={{display: "flex", marginRight: "10px"}}>
                                                <Star style={{color: "#FFCD3C"}}/>
                                                <Typography>{walker.Walker.rating}</Typography>
                                            </Box>

                                            <Typography variant="h6" style={{
                                                overflow: "hidden",
                                                whiteSpace: "wrap",
                                                textOverflow: "ellipsis",
                                                cursor: "pointer"
                                            }} onClick={e => goToProfile(walker.User.id)}>{walker.User.name}</Typography>
                                        </Box>
                                        <Typography style={{
                                            display: "-webkit-box",
                                            "-webkit-line-clamp": "3",
                                            "-webkit-box-orient": "vertical",
                                            overflow: "hidden"
                                        }}>{walker.Walker.schedule}</Typography>
                                        <Typography variant="h6" color="secondary">{walker.Walker.price_per_hour} руб /
                                            час</Typography>
                                    </Box>

                                </Box>

                                <Button onClick={() => sendButtonClick(walker.User.id)} className={classes.sendButton} color="secondary"
                                        variant="outlined">Отправить заявку
                                </Button>
                            </Box>
                            <Box>
                                { walker.Walker.stations.length > 0 ?
                                    walker.Walker.stations.map(station => (
                                        <Chip style={{background: station.color, color: "white"}}
                                              className={classes.station}
                                              label={station.value}/>
                                    ))
                                    :
                                    <Chip label="Любая станция" className={classes.station} style={{color: "white", background: "#008080"}}/>
                                }
                            </Box>
                        </Box>
                        </Paper>
                    ))
                }
            </Box>
        </Box>
    );
}
