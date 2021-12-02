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
    user: {
        display: "flex",
        alignItems: "center"
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

    const GreenTextTypography = withStyles({
        root: {
            color: "#008000",
        }
    })(Typography);



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
                <Box className={classes.userInfo}>
                    <Typography variant="h4">Клоун Смешной</Typography>
                    <Typography variant= "h6">Дни работы</Typography>
                    <Typography variant="h6">Пн-Чт 18-19</Typography>
                    <GreenTextTypography variant= "h7">Онлайн</GreenTextTypography>
                    <Typography variant= "h5">{}</Typography>
                </Box>
                <Box>
                <Button
                    type="submit"
                    fullWidth
                    size="large"
                    variant="contained"
                    color="gray"

                    //className={classes.}
                    // onClick={() => )}
                >
                    Написать сообщение
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
                    <Typography variant = "h4" > Отзывы </Typography>
                    reviews.map(review => (
                    <Paper style={{display: "flex"}}>
                        <Box>
                            <img src=""/>
                            <Typography>Иванов Иван</Typography>
                        </Box>
                        <Typography>Отзыв</Typography>
                    </Paper>
                    )
                </Box>
            </Box>
        </Box>);

}