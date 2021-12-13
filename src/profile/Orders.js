import React, {useEffect, useState} from "react";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Card,
    CardActions,
    CardContent,
    CardMedia, Divider,
    Paper,
    Typography
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {AdjustRounded, Brightness1Rounded, Timer} from "@material-ui/icons";
import theme from "../theme/muiTheme";
import axios from "axios";
import Review from "./Review";
import {getAccessToken} from "../utils/auth";

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "700px",
        margin: theme.spacing(2),
    },
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
    avatar: {
        margin: theme.spacing(2),
        width: "100px",
        height: "100px"
    },
    button: {
        margin: theme.spacing(1),
        width: "130px",
        height: "40px"
    }
}))
/*
- без ответа от волкера walker_took_order = null
- отказ волкера walker_took_order = false
- принят волкеров walker_took_order = true
- подтвержден клиентом client_confirmed_execution = true
- без ответа клиента client_confirmed_execution = null
- отклонен клиентом (т.е. волкер наебал и не погулял) = false
- оплачен клиентом = true
- не оплачен = false

 Заказы могут быть активными и завершенными
 Активные:
 - datetime_of_walking <= Date.now() && datetime_of_walking >= Date.now().setHours(number_of_hours) && walker_took_order == true
    Статус: Выполняется
 - datetime_of_walking > Date.now() && walker_took_order == null)
    Статус: Ожидание ответа
 - datetime_of_walking > Date.now() && walker_took_order == true)
    Статус: Ожидание выполнения
 - datetime_of_walking < Date.now() && (client_confirmed_execution == true || client_confirmed_execution == null) && (paid == false || paid == null)

 Завершенные:
 - datetime_of_walking < Date.now() && (paid == true || walker_took_order == false || client_confirmed_execution == false || client_confirmed_execution == null)

 */
export default function Orders(props) {
    console.log(props);
    const classes = useStyles();

    function OrderCard({order}) {
        const [status, setStatus] = useState("...");
        const [statusColor, setStatusColor] = useState(theme.palette.error.light)
        const [open, setOpen] = useState(false);

        /*
        -1 - ничего
        0 - принять или отклонить заказ (для волкера)
        1 - подтвердить или опровергнуть выполнение (для клиента)
        2 - оплатить (для клиента)
         */
        const [action, setAction] = useState(-1)


        useEffect(() => {
            const datetimeOfWalking = new Date(order.Order.datetime_of_walking);
            const datetimeOfEndWalking = new Date(order.Order.datetime_of_walking);
            datetimeOfEndWalking.setHours(datetimeOfEndWalking.getHours() + order.Order.numbers_of_hours)
            const nowDate = new Date()
            if (datetimeOfEndWalking >= nowDate && datetimeOfWalking <= nowDate && order.Order.walker_took_order === true) {
                setStatus("Выполняется")
                setStatusColor(theme.palette.info.light)
            } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order === true) {
                setStatus("Ожидается выполнение")
                setStatusColor(theme.palette.info.light)
            } else if (datetimeOfWalking > nowDate && order.Order.walker_took_order == null) {
                setStatus("Ожидается ответ")
                setStatusColor(theme.palette.warning.light)
                if (props.walker_id === order.Order.walker_id) {
                    setAction(0)
                }
            } else if (datetimeOfEndWalking < nowDate && order.Order.client_confirmed_execution === true && (order.Order.paid === false || order.Order.paid == null)) {
                setStatus("Ожидание оплаты")
                setStatusColor(theme.palette.warning.light)
                if (props.walker_id !== order.Order.walker_id) {
                    setAction(2)
                }
            } else if (datetimeOfEndWalking < nowDate && order.Order.walker_took_order === true && order.Order.client_confirmed_execution === null) {
                setStatus("Ожидание подтверждения")
                setStatusColor(theme.palette.warning.light)
                if (props.walker_id !== order.Order.walker_id) {
                    setAction(1)
                }
            } else if (datetimeOfEndWalking < nowDate && order.Order.paid === true) {
                setStatus("Оплачен")
                setStatusColor(theme.palette.success.light)
            } else if (order.Order.walker_took_order === false) {
                setStatus("Отказ в выполнении")
                setStatusColor(theme.palette.error.light)
            } else if (order.Order.client_confirmed_execution === false) {
                setStatus("Заказ не был выполнен")
                setStatusColor(theme.palette.error.dark)
            } else if (datetimeOfWalking < nowDate && order.Order.walker_took_order == null) {
                setStatus("Ответ не был получен")
                setStatusColor(theme.palette.error.light)
            } else {
                console.log("не работаем")
                console.log("какая-то хуйня с заказом:")
                console.log(order)
            }
        }, [])

        const takeOrder = async (isTaken) => {
            axios.patch("https://fast-api-walking-v1.herokuapp.com/order?order_id=" + order.Order.id, {
                "rating": null,
                "review": "",
                "walker_took_order": isTaken,
                "client_confirmed_execution": null,
                "paid": null
            }, {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    if (isTaken === false) {
                        let arr = [...props.orders];
                        let element = null;
                        arr = arr.filter(el => {
                            if (el.Order.id === order.Order.id) {
                                element = el;
                                return false
                            }
                            return true
                        })
                        props.setActiveOrders(arr);
                        const arr1 = [...props.endedOrders, element]
                        props.setEndedOrders(arr1);
                        setStatus("Отказ в выполнении")
                        setStatusColor(theme.palette.error.light)
                    } else {
                        setStatus("Ожидается выполнение")
                        setStatusColor(theme.palette.info.light)
                    }
                })
        }

        const confirm = async (isConfirmed) => {
            axios.patch("https://fast-api-walking-v1.herokuapp.com/order?order_id=" + order.Order.id, {
                "rating": null,
                "review": "",
                "walker_took_order": true,
                "client_confirmed_execution": isConfirmed,
                "paid": null
            }, {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    if (isConfirmed === false) {
                        let arr = [...props.orders];
                        let element = null;
                        arr = arr.filter(el => {
                            if (el.Order.id === order.Order.id) {
                                element = el;
                                return false
                            }
                            return true
                        })
                        props.setActiveOrders(arr);
                        const arr1 = [...props.endedOrders, element]
                        props.setEndedOrders(arr1);
                        setStatus("Заказ не был выполнен")
                        setStatusColor(theme.palette.error.dark)
                    } else {
                        setStatus("Ожидание оплаты")
                        setStatusColor(theme.palette.warning.light)
                    }
                })
        }

        const pay = async () => {
            setOpen(true);
            setStatus("Оплачен")
            setStatusColor(theme.palette.success.light)
        }

        const onPayClosed = async () => {
            let arr = [...props.orders];
            let element = null;
            arr = arr.filter(el => {
                if (el.Order.id === order.Order.id) {
                    element = el;
                    return false
                }
                return true
            })
            props.setActiveOrders(arr);
            const arr1 = [...props.endedOrders, element]
            props.setEndedOrders(arr1);
        }

        return (
            <>
                <Review id={order.Order.id} open={open} setOpen={setOpen} onPayClosed={onPayClosed}/>
                <Card className={classes.card}>
                    <Box style={{display: 'flex', flexDirection: 'column', alignItems: "center"}}>
                        <Paper className={classes.avatar}>
                            <CardMedia
                                style={{width: "100px", height: "100px"}}
                                component="img"
                                image="/logo_bot.png"
                            />
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography>
                                {order.Order.description}
                            </Typography>
                        </Paper>
                    </Box>
                    <Box style={{display: 'flex', flexDirection: 'column'}}>
                        <Paper className={classes.paper}>
                            <Typography component="div" variant="h5">
                                {order.Dog.nickname}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {new Date().getYear() - new Date(order.Dog.date_of_birth).getYear()} лет, {order.Dog.size_in_kg} кг
                            </Typography>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography component="div" variant="subtitle1" style={{fontWeight: "bold"}}>
                                Контактная информация
                            </Typography>
                            <Divider/>
                            <Typography component="div" variant="subtitle1">
                                {order.User.name}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {order.User.phone_number}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary" component="div">
                                {order.User.email}
                            </Typography>
                        </Paper>
                    </Box>
                    <Box style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle1">
                                {order.Order.datetime_of_walking.substr(0, order.Order.datetime_of_walking.indexOf("T"))}
                            </Typography>
                            <Typography variant="subtitle1">
                                {order.Order.datetime_of_walking.substr(order.Order.datetime_of_walking.indexOf("T") + 1, 8)}
                            </Typography>
                            <Typography variant="subtitle1" style={{display: "flex", alignItems: "center"}}>
                                <Timer style={{marginLeft: "-3px", marginRight: "3px"}}/>
                                {order.Order.numbers_of_hours} ч.
                            </Typography>
                            <div style={{display: "flex"}}>
                                <Typography variant="subtitle1" style={{marginLeft: "3px", marginRight: "10px"}}>
                                    {order.Order.price_without_commission - order.Order.commission} ₽
                                </Typography>
                                <Typography variant="subtitle1">
                                    {order.Order.price}
                                </Typography>
                            </div>
                        </Paper>
                        <Paper className={classes.paper} style={{display: "flex", alignItems: "flex-start"}}>
                            <Box>
                                <Typography variant="subtitle1" style={{fontWeight: "bold"}}>
                                    Статус:
                                </Typography>
                                <Typography variant="subtitle1">
                                    {status}
                                </Typography>
                            </Box>
                            <AdjustRounded style={{color: statusColor}}/>
                        </Paper>
                        {
                            action === -1 ?
                                <>
                                </>
                                :
                                action === 0 ?
                                    <CardActions>
                                        <Button variant="contained" className={classes.button} color="primary"
                                                onClick={() => {
                                                    takeOrder(true)
                                                }}>Принять</Button>
                                        <Button variant="contained" className={classes.button} style={{
                                            background: theme.palette.error.light,
                                            color: theme.palette.error.contrastText
                                        }} onClick={() => {
                                            takeOrder(false)
                                        }}>Отклонить</Button>
                                    </CardActions>
                                    :
                                    action === 1 ?

                                        <CardActions>
                                            <Button variant="contained" className={classes.button} color="primary"
                                                    onClick={() => {
                                                        confirm(true)
                                                    }}>Подтвердить</Button>
                                            <Button variant="contained" className={classes.button} style={{
                                                background: theme.palette.error.light,
                                                color: theme.palette.error.contrastText
                                            }} onClick={() => {
                                                confirm(false)
                                            }}>Опровергнуть</Button>
                                        </CardActions>
                                        :
                                        action === 2 ?
                                            <CardActions>
                                                <Button variant="contained" className={classes.button} color="primary"
                                                        onClick={() => {
                                                            pay()
                                                        }}>Оплатить</Button>
                                            </CardActions>
                                            :
                                            <></>
                        }
                    </Box>
                </Card>
            </>
        )
    }

    return (
        <>
            {
                props.orders.map((order, i) => (
                    <OrderCard key={i} order={order}/>
                ))
            }
        </>
    );
}
