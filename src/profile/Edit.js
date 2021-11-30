import React, {useRef, useState} from "react";
import {FormControl, FormLabel, Radio, RadioGroup, Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import {AddAPhoto, Adjust, Memory} from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert"
import Container from "@material-ui/core/Container";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from "react-router-dom";
import {setAccessToken, setRefreshToken} from "../utils/auth";

import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import Slider from "@material-ui/core/Slider";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    logo: {
        margin: theme.spacing(1),
        width: "100px",
        height: "100px"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: "center"
    },
    submit: {
        textTransform: "none",
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        width: "100%",
        margin: theme.spacing(2, 0, 1)
    },
    avatar: {
        width: "150px",
        height: "150px",
        borderRadius: "50%",
        cursor: "pointer"
    },
    add_photo_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        cursor: "pointer",
        border: "solid 5px",
        borderColor: theme.palette.primary.main
    },
    add_photo: {
        width: "65px",
        height: "65px",
        color: theme.palette.primary.main
    }
}));

export default function Edit() {
    const classes = useStyles();
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [fullname, setFullname] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [avatar, setAvatar] = useState("")
    const [avatarPicked, setAvatarPicked] = useState(false)
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const hiddenAvatarInput = useRef();

    const [userType, setUserType] = React.useState('walker');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await edit();
    }

    const handleUserType = (event) => {
        setUserType(event.target.value);
    };

    const handleAvatarChange = (event) => {
        if (event.target.files[0] != null) {
            setAvatar(event.target.files[0]);
            setAvatarPicked(true);
        }
    }


    const edit = async () => {
        if (userType === 'walker') {
            axios.post("https://fast-api-walking-v1.herokuapp.com/" + userType, {
                user_info: {
                    hashed_password: password,
                    fullname: fullname,
                    phone: phone,
                    email: email,
                    avatar_url: avatar
                },
                walker_info: {
                    rating: 0,
                    counter: 0,
                    region_code: 56,
                    price_per_hour: 500,
                    practice_in_year: 0,
                    min_dog_size_in_kg: 10,
                    max_dog_size_in_kg: 20,
                    min_dog_age_in_years: 1,
                    max_dog_age_in_years: 20,
                    schedule: "Я могу гулять по понедельникам с 9:00 до 18:00",
                    about_walker: "Я Иван Чернышев, дотер"
                }
            })
                .then(response => {
                    history.push("/signin")
                    console.log(response);
                })
        } else {
            axios.post("https://fast-api-walking-v1.herokuapp.com/" + userType, {
                hashed_password: password,
                fullname: fullname,
                phone: phone,
                email: email,
                avatar_url: avatar
            })
                .then(response => {
                    history.push("/signin")
                    console.log(response);
                })
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <img className={classes.logo} src={"/logo_bot.png"}/>
                <Typography component="h1" variant="h5">
                    Edit page
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>

                    { avatarPicked ?
                        <img className={classes.avatar} alt="avatar" onClick={() => hiddenAvatarInput.current.click()}
                             src={avatarPicked && avatar && URL.createObjectURL(avatar)}/>
                        :
                        <Box className={classes.add_photo_box}>
                            <AddAPhoto className={classes.add_photo}/>
                        </Box>
                    }
                    <input
                        accept="image/*"
                        type="file"
                        id="main_image"
                        hidden
                        ref={hiddenAvatarInput}
                        onChange={handleAvatarChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="fullname"
                        label="Fullname"
                        type="Fullname"
                        id="fullname"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}

                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="Phone"
                        type="Phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={phoneError !== ""}
                        helperText={phoneError}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={emailError !== ""}
                        helperText={emailError}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError !== ""}
                        helperText={passwordError}
                    />
                    {
                        (userType === 'walker') ?
                            <WalkerInfo ref={WalkerInfo}/>
                            :
                            <>
                            </>
                    }
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={edit}
                    >
                        {loading ? <CircularProgress size={24} color="inherit"/> : "Edit"}
                    </Button>
                </form>
                {
                    error &&
                    <Alert className={classes.alert} severity="error">
                        {error}
                    </Alert>
                }
            </div>
        </Container>
    );
}

function WalkerInfo() {
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
