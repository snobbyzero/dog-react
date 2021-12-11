import React, {useEffect, useRef, useState} from "react";
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
import {getAccessToken, setAccessToken, setRefreshToken} from "../utils/auth";

import Box from "@material-ui/core/Box";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Chip from "@material-ui/core/Chip";
import Slider from "@material-ui/core/Slider";
import WalkerInfo from "../signup/WalkerInfo";
// TODO переделать как в сайнапе
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
    const [fullnameError, setFullnameError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [avatar, setAvatar] = useState("")
    const [avatarPicked, setAvatarPicked] = useState(false)
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [selectedStations, setSelectedStations] = useState([]);
    const [price, setPrice] = useState(10);
    const [minSizeDog, setMinSizeDog] = useState(0);
    const [maxSizeDog, setMaxSizeDog] = useState(1);
    const [minAgeDog, setMinAgeDog] = useState(0);
    const [maxAgeDog, setMaxAgeDog] = useState(1);
    const [schedule, setSchedule] = useState("");
    const [aboutWalker, setAboutWalker] = useState("");
    const hiddenAvatarInput = useRef();
    const [userInfo, setUserInfo] = useState();
    const [walkerInfo, setWalkerInfo] = useState();
    const [userType, setUserType] = useState('walker');

    useEffect(() => {
        const getUser = async () => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/user/curr", {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(async res => {
                    console.log(res.data)
                    setUserInfo(res.data);
                    setFullname(res.data.name)
                    setEmail(res.data.email)
                    setAvatar(res.data.avatar)
                    setPhone(res.data.phone_number)
                    if (res.data.walker_id != null) {
                        axios.get("https://fast-api-walking-v1.herokuapp.com/walker/curr", {
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken()}`
                            }
                        })
                            .then(response => {
                                console.log(response.data)
                                setWalkerInfo(response.data.Walker);
                                setPrice(response.data.Walker.price_per_hour)
                                setSelectedStations(response.data.Walker.stations.map(station => {
                                    return {"value": station, "data": {color: "", name: station}}
                                }))
                                setMinSizeDog(response.data.Walker.min_dog_size_in_kg)
                                setMaxSizeDog(response.data.Walker.max_dog_size_in_kg)
                                setMinAgeDog(response.data.Walker.min_dog_age_in_years)
                                setMaxAgeDog(response.data.Walker.max_dog_age_in_years)
                                setSchedule(response.data.Walker.schedule)
                                setAboutWalker(response.data.Walker.about_walker)
                            })
                    } else {
                        setUserType('client');
                    }
                })
        }
        getUser()
    }, [])

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
        if (email === "") {
            setEmailError("Введите почту")
        } else if (password === "") {
            setPasswordError("Введите пароль")
        } else if (fullname === "") {
            setFullnameError("Введите фамилию и имя")
        } else if (phone === "") {
            setPhoneError("Введите номер телефона")
        } else {
            setLoading(true)
            setEmailError("")
            setPhoneError("")
            setPasswordError("")
            setFullnameError("")
            setError("")
            if (userType === 'walker') {
                console.log(email)
                console.log(password)
                console.log(fullname)
                console.log(phone)
                axios.patch("https://fast-api-walking-v1.herokuapp.com/user/", {
                    email: email,
                    password: password,
                    name: fullname,
                    phone_number: phone,
                }, {
                    headers: {
                        "Authorization": `Bearer ${await getAccessToken()}`
                    }
                })
                    .then(async res => {
                        console.log(res.data)
                        if (avatar) {
                            const formData = new FormData();
                            formData.append('image', avatar);
                            axios.post("https://fast-api-walking-v1.herokuapp.com/user/avatar", formData, {
                                headers: {
                                    "Authorization": `Bearer ${await getAccessToken()}`
                                }
                            })
                                .then(response => {
                                    console.log("USER AVATAR: ")
                                    console.log(response)
                                })
                        }
                        console.log(selectedStations)

                        await axios.post("https://fast-api-walking-v1.herokuapp.com/walker/", {
                            "price_per_hour": price,
                            "stations": selectedStations.map(station => station.value),
                            "min_dog_size_in_kg": minSizeDog,
                            "max_dog_size_in_kg": maxSizeDog,
                            "min_dog_age_in_years": minAgeDog,
                            "max_dog_age_in_years": maxAgeDog,
                            "schedule": schedule,
                            "about_walker": aboutWalker
                        }, {
                            headers: {
                                "Authorization": `Bearer ${await getAccessToken()}`
                            }
                        })
                        setLoading(false)
                        history.push("/myprofile")
                        console.log(res);
                    })
                    .catch(err => {
                        setLoading(false)
                        console.log(err);
                        if (err.response) {
                            //console.log(err.response.data.detail)
                            setError(err.response.data.detail[0].msg)
                        }
                    })
            } else {
                axios.patch("https://fast-api-walking-v1.herokuapp.com/user", {
                    password: password,
                    name: fullname,
                    phone_number: phone,
                    email: email,
                }, {
                    headers: {
                        "Authorization": `Bearer ${await getAccessToken()}`
                    }
                })
                    .then(async res => {
                        await setAccessToken(res.data['access_token']);
                        await setRefreshToken(res.data['refresh_token']);
                        if (avatar) {
                            const formData = new FormData();
                            formData.append('image', avatar);
                            axios.post("https://fast-api-walking-v1.herokuapp.com/user/avatar", formData)
                                .then(response => {
                                    console.log("USER AVATAR: ")
                                    console.log(response)
                                })
                        }
                        setLoading(false)
                        history.push("/myprofile")
                        console.log(res);
                    })
                    .catch(error => {
                        setLoading(false)
                        if (error.response) {
                            //console.log(err.response.data.detail)
                            setError(error.response.data.detail[0].msg)
                        }
                    })
            }
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
                        error={fullnameError !== ""}
                        helperText={fullnameError}
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
                            <WalkerInfo
                                selectedStations={selectedStations}
                                setSelectedStations={setSelectedStations}
                                price={price}
                                setPrice={setPrice}
                                minSizeDog={minSizeDog}
                                setMinSizeDog={setMinSizeDog}
                                maxSizeDog={maxSizeDog}
                                setMaxSizeDog={setMaxSizeDog}
                                minAgeDog={minAgeDog}
                                setMinAgeDog={setMinAgeDog}
                                maxAgeDog={maxAgeDog}
                                setMaxAgeDog={setMaxAgeDog}
                                schedule={schedule}
                                setSchedule={setSchedule}
                                aboutWalker={aboutWalker}
                                setAboutWalker={setAboutWalker}
                            />
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

