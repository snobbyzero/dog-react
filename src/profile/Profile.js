import {useEffect, useState} from "react";
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
        width: "300px",
        height: "300px",
        marginRight: theme.spacing(2)
    },
    userInfo: {
        marginLeft: theme.spacing(2),
        display: "flex",
        flexFlow: "column"
    }
}))

export default function Profile() {
    const classes = useStyles();
    const [userInfo, setUserInfo] = useState("");
    const [dogs, setDogs] = useState([]);
    const [tabs, setTabs] = useState([]);
    const [selectedTab, setSelectedTab] = useState(1);
    const [orders, setOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [waitingOrders, setWaitingOrders] = useState([]);

    useEffect(async () => {
        const accessToken = await getAccessToken();
        console.log(`access token: ${accessToken}`)
        axios.get("https://fast-api-walking-v1.herokuapp.com/user", {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        })
            .then(res => {
                setUserInfo(res.data);
                console.log(res);

                if (res.data.client_id) {
                    axios.get("https://fast-api-walking-v1.herokuapp.com/dog", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(res => {
                            console.log("dogs");
                            console.log(res.data);
                            setDogs(res.data);
                        })
                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/client", {
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
                                    element: <DogsTab dogs={dogs}/>
                                },
                                {
                                    name: "Активные заказы",
                                    element: <ActiveOrdersClient
                                        orders={orders.filter(order => new Date(order.datetime_of_walking) >= new Date() && order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Завершенные заказы",
                                    element: <CompletedOrdersClient
                                        orders={orders.filter(order => new Date(order.datetime_of_walking) < new Date() && order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Ожидают ответа",
                                    element: <WaitingResponseOrdersClient
                                        orders={orders.filter(order => new Date(order.datetime_of_walking) < new Date() && (order.paid === null || order.client_confirmed_execution === null))}/>
                                }
                            ])
                        })
                } else {
                    axios.get("https://fast-api-walking-v1.herokuapp.com/order/walker", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    })
                        .then(res => {
                            setOrders(res.data);
                            console.log(res.data)
                            setTabs([
                                {
                                    name: "Активные заказы",
                                    element: <ActiveOrdersWalker
                                        orders={orders.filter(order => new Date(order.order.datetime_of_walking) >= new Date() && order.order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Завершенные заказы",
                                    element: <CompletedOrdersWalker
                                        orders={orders.filter(order => new Date(order.order.datetime_of_walking) < new Date() && order.order.walker_took_order === true)}/>
                                },
                                {
                                    name: "Ожидают ответа",
                                    element: <WaitingResponseOrdersWalker
                                        orders={orders.filter(order => new Date(order.order.datetime_of_walking) >= new Date() && order.order.walker_took_order === null)}/>
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
                <Box className={classes.userInfo}>
                    <Typography variant="h4">{userInfo.fullname}</Typography>
                    <Typography variant="h6">{userInfo.email}</Typography>
                    <Typography variant="h6">{userInfo.phone}</Typography>

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