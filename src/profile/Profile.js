import React, {useEffect, useState} from "react";
import axios from "axios";
import {getAccessToken} from "../utils/auth";
import {AppBar, makeStyles, Typography} from "@material-ui/core";
import ActiveOrdersWalker from "./ActiveOrdersWalker";
import CompletedOrdersWalker from "./CompletedOrdersWalker";
import DogsTab from "./DogsTab";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import ActiveOrdersClient from "./ActiveOrdersClient";
import CompletedOrdersClient from "./CompletedOrdersClient";
import WaitingResponseOrdersClient from "./WaitingResponseOrdersClient";
import WaitingResponseOrdersWalker from "./WaitingResponseOrdersWalker";
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
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [orders, setOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [waitingOrders, setWaitingOrders] = useState([]);
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
                console.log(res);

                if (!res.data.walker_id) {
                    console.log("not walker")
                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/client_all", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(res => {
                            console.log("orders client")
                            console.log(res.data)
                            setOrders(res.data)
                            setTabs([
                                {
                                    name: "Мои собаки",
                                    element: <DogsTab/>
                                },
                                {
                                    name: "Активные заказы",
                                    element: <ActiveOrdersClient
                                        orders={res.data.filter(order => new Date(order.Order.datetime_of_walking) >= new Date() && order.Order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Завершенные заказы",
                                    element: <CompletedOrdersClient
                                        orders={res.data.filter(order => {
                                            console.log(new Date(order.Order.datetime_of_walking))
                                            console.log(new Date())
                                            console.log(new Date(order.Order.datetime_of_walking) < new Date())
                                            return new Date(order.Order.datetime_of_walking) < new Date()
                                        })}/>
                                },
                                {
                                    name: "Ожидают ответа",
                                    element: <WaitingResponseOrdersClient
                                        orders={res.data.filter(order => (
                                            new Date(order.Order.datetime_of_walking) < new Date() &&
                                            order.Order.walker_took_order === true &&
                                                (order.Order.paid === null || order.Order.client_confirmed_execution === null)
                                            ||
                                            (order.Order.walker_took_order === null && new Date(order.Order.datetime_of_walking) >= new Date())
                                        ))}/>
                                }
                            ])
                        })
                } else {

                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/walker_all", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(res => {
                            setOrders(res.data);
                            console.log(res.data)
                            setTabs([
                                {
                                    name: "Мои собаки",
                                    element: <DogsTab/>
                                },
                                {
                                    name: "Активные заказы",
                                    element: <ActiveOrdersWalker
                                        orders={res.data.filter(order => new Date(order.order.datetime_of_walking) >= new Date() && order.order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Завершенные заказы",
                                    element: <CompletedOrdersWalker
                                        orders={res.data.filter(order => new Date(order.order.datetime_of_walking) < new Date() && order.order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Ожидают ответа",
                                    element: <WaitingResponseOrdersWalker
                                        orders={res.data.filter(order => new Date(order.order.datetime_of_walking) >= new Date() && order.order.walker_took_order === null)}/>
                                }
                            ])
                        })
                }
            })


    }, [])

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
                <img className={classes.avatar} src="/logo_bot.png"/>
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
                            <Tab label={tab.name} key={key}/>
                        ))
                        }
                    </Tabs>
                </AppBar>
                {
                    tabs.map((tab, key) => (
                        <TabPanel value={selectedTab} index={key}>
                            {
                                tab.element
                            }
                        </TabPanel>
                    ))
                }
            </Box>
        </Box>
    );
}
