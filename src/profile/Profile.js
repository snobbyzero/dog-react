import React, {useEffect, useState} from "react";
import axios from "axios";
import {getAccessToken} from "../utils/auth";
import {AppBar, makeStyles, Typography} from "@material-ui/core";
import DogsTab from "./DogsTab";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom';
import Orders from "./Orders";
import Reviews from "./Reviews";

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
        margin: theme.spacing(1)
    },
    avatar: {
        width: "300px",
        height: "300px",
        marginRight: theme.spacing(2)
    },
    userInfo: {
        marginLeft: theme.spacing(2),
        display: "flex",
        flexFlow: "column",
        justifyContent: "start",
        flexGrow: 1
    },
    submit: {
        margin: theme.spacing(2),
        marginBottom: theme.spacing(4)
    }
}))

export default function Profile() {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState("");
    const [avatar, setAvatar] = useState("")
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [activeOrders, setActiveOrders] = useState([]);
    const [endedOrders, setEndedOrders] = useState([]);
    const history = useHistory();


    useEffect(async () => {
        const accessToken = await getAccessToken();
        console.log(`access token: ${accessToken}`)
        axios.get("https://fast-api-walking-v1.herokuapp.com/user/curr", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setUserInfo(res.data);
                setAvatar(res.data.id)
                console.log(res);

                if (!res.data.walker_id) {
                    console.log("client")
                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/client_all", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(res => {
                            console.log("orders client")
                            console.log(res.data)
                            const actOrders = res.data.filter(order => {
                                const datetimeOfWalking = new Date(order.Order.datetime_of_walking);
                                const datetimeOfEndWalking = new Date(order.Order.datetime_of_walking);
                                datetimeOfEndWalking.setHours(datetimeOfEndWalking.getHours() + order.Order.numbers_of_hours)
                                const nowDate = new Date();
                                if (datetimeOfEndWalking >= nowDate && datetimeOfWalking <= nowDate && order.Order.walker_took_order === true) {
                                    return true;
                                } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order === true) {
                                    return true;
                                } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order == null) {
                                    return true
                                } else if (datetimeOfEndWalking < nowDate && order.Order.client_confirmed_execution === true && (order.Order.paid === false || order.Order.paid == null)) {
                                    return true
                                } else if (datetimeOfEndWalking < nowDate && order.Order.walker_took_order === true && order.Order.client_confirmed_execution === null) {
                                    return true
                                }
                                console.log("false")
                                return false
                            })
                            setActiveOrders(actOrders)
                            const endOrders = res.data.filter(order => {
                                const datetimeOfWalking = new Date(order.Order.datetime_of_walking);
                                const datetimeOfEndWalking = new Date(order.Order.datetime_of_walking);
                                datetimeOfEndWalking.setHours(datetimeOfEndWalking.getHours() + order.Order.numbers_of_hours)
                                const nowDate = new Date();
                                if (datetimeOfEndWalking < nowDate && order.Order.paid === true) {
                                    return true;
                                } else if (order.Order.walker_took_order === false) {
                                    return true;
                                } else if (order.Order.client_confirmed_execution === false) {
                                    return true
                                } else if (datetimeOfWalking < nowDate && order.Order.walker_took_order == null) {
                                    return true;
                                }
                                return false;
                            })
                            setEndedOrders(endOrders)
                            setTabs([
                                {
                                    name: "Мои собаки",
                                    element: <DogsTab key={0}/>
                                },
                                {
                                    name: "Заказы",
                                    element: <Orders key={activeOrders.length+"_"} walker_id={userInfo.walker_id}
                                        orders={activeOrders} endedOrders={endedOrders} setActiveOrders={(state) => {setActiveOrders(state)}} setEndedOrders={(state) => {setEndedOrders(state)}}/>
                                },
                                {
                                    name: "История",
                                    element: <Orders key={"_"+endedOrders.length} walker_id={userInfo.walker_id}
                                        orders={endedOrders}/>
                                }
                            ])
                        })
                } else {

                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/client_all", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(resp => {
                            console.log("orders client")
                            console.log(resp.data)

                            axios.get("https://fast-api-walking-v1.herokuapp.com/order/walker_all", {
                                headers: {
                                    "Authorization": `Bearer ${accessToken}`
                                }
                            })
                                .then(response => {
                                    console.log("orders walker")
                                    console.log(response.data)

                                    const actOrders = [...resp.data, ...response.data].filter(order => {
                                        const datetimeOfWalking = new Date(order.Order.datetime_of_walking);
                                        const datetimeOfEndWalking = new Date(order.Order.datetime_of_walking);
                                        datetimeOfEndWalking.setHours(datetimeOfEndWalking.getHours() + order.Order.numbers_of_hours)
                                        const nowDate = new Date();
                                        if (datetimeOfEndWalking >= nowDate && datetimeOfWalking <= nowDate && order.Order.walker_took_order === true) {
                                            return true;
                                        } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order === true) {
                                            return true;
                                        } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order == null) {
                                            return true
                                        } else if (datetimeOfEndWalking < nowDate && order.Order.client_confirmed_execution === true && (order.Order.paid === false || order.Order.paid == null)) {
                                            return true
                                        } else if (datetimeOfEndWalking < nowDate && order.Order.walker_took_order === true && order.Order.client_confirmed_execution === null) {
                                            return true
                                        }
                                        return false
                                    })
                                    setActiveOrders(actOrders)
                                    const endOrders = [...resp.data, ...response.data].filter(order => {
                                        const datetimeOfWalking = new Date(order.Order.datetime_of_walking);
                                        const datetimeOfEndWalking = new Date(order.Order.datetime_of_walking);
                                        datetimeOfEndWalking.setHours(datetimeOfEndWalking.getHours() + order.Order.numbers_of_hours)
                                        const nowDate = new Date();
                                        if (datetimeOfEndWalking < nowDate && order.Order.paid === true) {
                                            return true;
                                        } else if (order.Order.walker_took_order === false) {
                                            return true;
                                        } else if (order.Order.client_confirmed_execution === false) {
                                            return true
                                        } else if (datetimeOfWalking < nowDate && order.Order.walker_took_order == null) {
                                            return true;
                                        }
                                        return false;
                                    })
                                    setEndedOrders(endOrders)

                                    setTabs([
                                        {
                                            name: "Мои собаки",
                                            element: <DogsTab key={3}/>
                                        },
                                        {
                                            name: "Заказы",
                                            element: <Orders key={activeOrders.length+"_"} walker_id={res.data.walker_id}
                                                             orders={activeOrders} endedOrders={endedOrders} setActiveOrders={(state) => {setActiveOrders(state)}} setEndedOrders={(state) => {setEndedOrders(state)}}/>
                                        },
                                        {
                                            name: "История",
                                            element: <Orders key={"_"+endedOrders.length} walker_id={res.data.walker_id}
                                                orders={endedOrders}/>
                                        },
                                        {
                                            name: "Отзывы",
                                            element: <Reviews key={6} id={res.data.id}/>
                                        }
                                    ])
                                })
                        })
                }
            })


    }, [])


    useEffect(() => {
        console.log("ACTIVE ORDERS")
        console.log(activeOrders)
    }, [activeOrders])

    useEffect(() => {
        console.log(activeOrders)
    }, [true])

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
                <img className={classes.avatar} src={avatar}/>
                <Box style={{display: "flex", flexDirection: "column"}}>
                    <Box className={classes.userInfo}>
                        <Typography variant="h4">Имя: {userInfo.name}</Typography>
                        <Typography variant="h6">Почта: {userInfo.email}</Typography>
                        <Typography variant="h6">Тел. номер: {userInfo.phone_number}</Typography>
                    </Box>
                    <Button
                        type="submit"
                        fullWidth
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => history.push("/edit")}
                    >
                        Редактировать
                    </Button>
                </Box>
            </Box>
            <Box>
                <AppBar position="static" color="secondary">
                    <Tabs value={selectedTab} onChange={tabHandleChange}>
                        {tabs.map((tab, key) => (
                            <Tab label={tab.name} key={tab.element.key}/>
                        ))
                        }
                    </Tabs>
                </AppBar>
                {
                    tabs.map((tab, key) => (
                        <TabPanel value={selectedTab} index={key}>
                            {
                                tab.name === 'Заказы' ?
                                    <Orders key={activeOrders} walker_id={userInfo.walker_id}
                                            orders={activeOrders} endedOrders={endedOrders} setActiveOrders={(state) => {setActiveOrders(state)}} setEndedOrders={(state) => {setEndedOrders(state)}}/>
                                :
                                    tab.name === 'История' ?
                                        <Orders key={endedOrders} walker_id={userInfo.walker_id}
                                                orders={endedOrders}/>
                                :
                                    tab.element


                            }
                        </TabPanel>
                    ))
                }
            </Box>
        </Box>
    );
}
