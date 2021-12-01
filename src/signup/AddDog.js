import DogsCards from "../dogs/DogsCards";
import React from "react";
import Button from "@material-ui/core/Button";
import {useHistory} from "react-router-dom";
import {Box} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(2),
        width: "150px",
        height: "50px"
    },
    root: {
        display: "flex",
        flexDirection: "column",
        width: "70vw",
        marginRight: "auto",
        marginLeft: "auto"
    }
}));
export default function AddDog() {
    const classes = useStyles();
    const history = useHistory();

    return (
        <Box className={classes.root}>
            <Box>
                <DogsCards dogs={[]}/>
            </Box>
            <Box style={{display: "flex", width: "100%", justifyContent: "end"}}>
                <Button variant="contained" color="secondary" className={classes.button} onClick={() => history.push("/")}>Далее</Button>
            </Box>
        </Box>
    )
}
