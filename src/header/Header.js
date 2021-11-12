import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Memory} from "@material-ui/icons";
import {Typography} from "@material-ui/core";

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

    },
    name: {
        flexGrow: 1
    },
}));

export default function Header() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className={classes.appbar}>
                <Toolbar style={{height: "90px"}}>
                    <Typography color="secondary" variant="h3" className={classes.name}>
                        жЫвотные
                    </Typography>
                    <Button className={classes.signin}>
                        <Typography variant="h5" color="secondary">
                            Sign In
                        </Typography>
                    </Button>
                </Toolbar>
            </AppBar>
        </div>
    )
}