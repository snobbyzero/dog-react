import React, {useEffect, useState} from "react";
import {AppBar, List, ListItem, makeStyles, Paper, Typography, withStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
        marginLeft: "auto",
        marginRight: "auto",
        width: "60vw",
        display: "flex",
        flexFlow: "column wrap",
        margin: theme.spacing(2)
    },
    review: {
        margin: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: "300px"
    },
    user: {
        display: "flex",
        alignItems: "flex-start"
    },
    avatar: {
        width: "200px",
        height: "250px",
        marginRight: theme.spacing(2)
    },
    userInfo: {
        marginLeft: theme.spacing(2),
        display: "flex",
        flexFlow: "column"
    },
    walkerImage: {
        width: "30px",
        height: "30px",
        borderRadius: "50%",
        cursor: "pointer",
        margin: theme.spacing(1)
    },
    reviewText: {
        margin: theme.spacing(1)
    },
    sendButton: {
        margin: theme.spacing(1),
        width: "200px",
        height: "50px"
    }
}))

export default function WalkerProfile() {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState("");
    const [walkerInfo, setWalkerInfo] = useState("");
    const [dogs, setDogs] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [orders, setOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [waitingOrders, setWaitingOrders] = useState([]);
    const history = useHistory();
    const [reviews, setReviews] = useState([]);


    const tabHandleChange = (event, newValue) => {
        setSelectedTab(newValue)
    }

    function TabPanel(props) {
        const {children, value, index, ...other} = props;
        return (
            <div {...other}>
                {value === index && <Box p={3}>{children}</Box>}
            </div>
        );
    }

    return (
        <Box className={classes.root}>
            <Box className={classes.user}>
                <img className={classes.avatar} src={classes.userInfo.avatar_url}/>
                <Box style={{display: "flex", flexDirection: "column", justifyContent: "space-between", height: "250px"}}>
                    <Box className={classes.userInfo}>
                        <Typography variant="h4">Клоун Смешной</Typography>
                        <Typography variant="h6">Дни работы</Typography>
                        <Typography variant="h6">Пн-Чт 18-19</Typography>
                    </Box>
                        <Button
                            type="submit"
                            fullWidth
                            size="large"
                            variant="contained"
                            color="primary"
                            className={classes.sendButton}
                            //className={classes.}
                            // onClick={() => )}
                        >
                            Связаться
                        </Button>
                </Box>
            </Box>
            <Box>
                <Typography>
                    {walkerInfo.about_walker}
                    gdfjosjpo;lfgmz[p
                    вgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
                    вппвgggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg
                    впрвеаыыыыыоggggggggggggggggggggggggggggggggggggggggggggggggggggggg
                </Typography>
                <Box>
                    <Typography variant="h4"> Отзывы </Typography>
                    {
                        [0, 1, 2, 3].map(review => (
                            <Paper className={classes.review}>
                                <Box style={{display: "flex", alignItems: "center"}}>
                                    <img className={classes.walkerImage}
                                         src="https://upload.wikimedia.org/wikipedia/ru/thumb/4/4d/Wojak.png/200px-Wojak.png"/>
                                    <Typography>Иванов Иван</Typography>
                                </Box>
                                <Typography className={classes.reviewText}>Отзыв</Typography>
                            </Paper>
                        ))
                    }
                </Box>
            </Box>
        </Box>);

}
