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
import WalkerInfo from "../signup/WalkerInfo";
import Box from "@material-ui/core/Box";

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
    const walkerInfo = useRef();
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
                    <Box style={{display: "flex", width: "100%"}}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Status</FormLabel>
                            <RadioGroup
                                aria-label="status"
                                defaultValue="Walker"
                                name="radio-buttons-group"
                                value={userType}
                                onChange={handleUserType}
                                row
                            >
                                <FormControlLabel value="walker" control={<Radio/>} label="Walker"/>
                                <FormControlLabel value="client" control={<Radio/>} label="Client"/>
                            </RadioGroup>
                        </FormControl>
                    </Box>
                    {
                        (userType === 'walker') ?
                            <WalkerInfo ref={walkerInfo}/>
                            :
                            <>
                            </>
                    }

                    <FormControlLabel
                        control={
                            <Checkbox
                                value={acceptTerms}
                                onChange={() => setAcceptTerms(!acceptTerms)}
                                color="primary"
                            />
                        }
                        label={
                            <Typography>
                                {"I confirm that I am 18 years old and accept "}
                                <Link color="secondary" href="#">Terms of Service and Privacy Policy</Link>
                            </Typography>
                        }
                    />
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
