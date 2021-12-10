import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Memory} from "@material-ui/icons";
import {Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {getAccessToken} from "../utils/auth";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        textDecoration: "none"
    },
    menuButton: {
        marginRight: theme.spacing(3),
    },
    navLink: {
        marginRight: theme.spacing(3)
    },
    icon: {
        marginRight: theme.spacing(2)
    },
    appbar: {
        backgroundImage: "url(/header.png)",
    },
    signin: {
        background: "white",
    },
    logo_box: {
        flexGrow: 1,
    },
    logo: {
    },
    username: {

    }
}));

export default function Header() {
    const classes = useStyles();
    const [isSignedIn, setIsSignedIn] = useState(false);
    const history = useHistory();

    useEffect(() => {
        getAccessToken()
            .then(res => {
                if (res) {
                    setIsSignedIn(true)
                }
            })
    })

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar style={{height: "90px"}}>
                    <Box className={classes.logo_box}>
                        <img className={classes.logo} src="/logo_right.png"/>
                    </Box>
                    { isSignedIn ?
                        <Button className={classes.username}>
                            <Typography style={{fontWeight: "bold"}} variant="h5" color="primary" onClick={() => {history.push("/myprofile")}}>
                                Мой профиль
                            </Typography>
                        </Button>
                            :
                        <Button variant="contained" className={classes.signin}>
                            <Typography style={{fontWeight: "bold"}} variant="h5" color="primary" onClick={() => {history.push("/signin")}}>
                                Sign In
                            </Typography>
                        </Button>
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
}
