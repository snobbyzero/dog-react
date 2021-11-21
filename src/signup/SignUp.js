import React, {useState} from "react";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import {Memory} from "@material-ui/icons";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Alert from "@material-ui/lab/Alert"
import Container from "@material-ui/core/Container";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        width: "250px",
        height: "250px"
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        textTransform: "none",
        margin: theme.spacing(3, 0, 2),
    },
    alert: {
        width: "100%",
        margin: theme.spacing(2, 0, 1)
    }
}));

export default function SignUp() {
    const classes = useStyles();

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [fullname, setFullname] = useState("");
    const [fullnameError, setFullnameError] = useState("");
    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("")
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup();
    }

    const signup = async () => {
        axios.post("https://fast-api-walking-v1.herokuapp.com/walker", {
            user_info: {
                username: username,
                hashed_password: password,
                fullname: fullname,
                phone: phone,
                email: email,
                avatar_url: avatarUrl
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
                console.log(response);
            })
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                <img className={classes.avatar} src={"/logo_bot.png"}/>
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="username"
                        label="username"
                        type="Username"
                        id="username"
                        value={password}
                        onChange={(e) => setUsername(e.target.value)}
                        error={passwordError !== ""}
                        helperText={passwordError}
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

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="fullrname"
                        label="fullname"
                        type="Fullname"
                        id="fullname"
                        value={password}
                        onChange={(e) => setFullname(e.target.value)}
                        error={passwordError !== ""}
                        helperText={passwordError}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="phone"
                        label="phone"
                        type="Phone"
                        id="phone"
                        value={password}
                        onChange={(e) => setPhone(e.target.value)}
                        error={passwordError !== ""}
                        helperText={passwordError}
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
                    <FormControlLabel
                        control={
                            <Checkbox
                                value={rememberMe}
                                color="primary"
                                onChange={() => setRememberMe(!rememberMe)}
                            />
                        }
                        label={
                            <Typography>
                                Remember me
                            </Typography>
                        }
                    />
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
                        onClick={signup}
                    >
                        {loading ? <CircularProgress size={24} color="inherit"/> : "Sign Up"}
                    </Button>
                </form>
                <Grid container>
                    <Grid item>
                        <Link href="/signin" variant="body2" color="secondary">
                            Already have an account? Sign In
                        </Link>
                    </Grid>
                </Grid>
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