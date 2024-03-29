import React, {useEffect, useState} from "react";
import {Typography} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Avatar from "@material-ui/core/Avatar";
import {Memory} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import axios from "axios";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useHistory} from 'react-router-dom';

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
        margin: theme.spacing(1, 0, 2),
    },
    alert: {
        width: "100%",
        margin: theme.spacing(2, 0, 1)
    },
    progress: {
        margin: theme.spacing(3)
    }
}));

export default function SignIn() {
    const classes = useStyles();

    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin()
    }

    const signin = async () => {
    }


    const buttonClick = async () => {
        /*
        axios.post("https://fast-api-walking-v1.herokuapp.com/walker", {
            user_info: {
                username: "ivan",
                hashed_password: "qwerty",
                fullname: "ivan chernyshev ivanovich",
                phone: "89004444333",
                email: "test@gmail.com",
                avatar_url: "https://cs.pikabu.ru/post_img/big/2013/12/31/9/1388645055_1336973337.jpg"
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

         */
        console.log(username);
        console.log(password);
        axios.post("https://fast-api-walking-v1.herokuapp.com/user/auth", {
            login: username,
            password: password
        }).then(res => {
            console.log(res);
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <div className={classes.paper}>
                    <img className={classes.avatar} src={"/logo_bot.png"}/>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        error={usernameError !== ""}
                        helperText={usernameError}
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
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={buttonClick}
                    >
                        {loading ? <CircularProgress size={24} color="inherit"/> : "Sign In"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" color="secondary">
                                Forgot password?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2" color="secondary">
                                Don't have an account? Sign Up
                            </Link>
                        </Grid>
                    </Grid>
                    {
                        error &&
                        <Alert className={classes.alert} severity="error">
                            {error}
                        </Alert>
                    }
                </form>
            </div>
        </Container>
    );
}