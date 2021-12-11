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
import {setAccessToken, setRefreshToken} from "../utils/auth";

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
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signin()
    }

    const signin = async () => {
    }


    const buttonClick = async () => {
        console.log(email);
        console.log(password);
        if (email === "") {
            setEmailError("Введите почту");
        } else if (password === "") {
            setPasswordError("Введите пароль");
        } else {
            setEmailError("")
            setPasswordError("")
            setError("")
            setLoading(true)
            axios.post("https://fast-api-walking-v1.herokuapp.com/login", {
                email: email,
                password: password
            }).then(res => {
                console.log(res.data);
                setAccessToken(res.data['access_token']);
                setRefreshToken(res.data['refresh_token']);
                console.log(res);
                setLoading(false);
                history.push("/")
            }).catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data)
                    setError(err.response.data.detail[0].msg)
                }
                setLoading(false)
            })
        }
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
                        id="email"
                        type="email"
                        label="Почта"
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
                        label="Пароль"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={passwordError !== ""}
                        helperText={passwordError}
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
                        {loading ? <CircularProgress size={24} color="inherit"/> : "Войти"}
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link href="#" variant="body2" color="secondary">
                                Забыли пароль?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2" color="secondary">
                                Нет аккаунта? Зарегистрируйтесь
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
