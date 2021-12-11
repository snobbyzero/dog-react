import React, {useState} from "react";
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
import {Brightness1Rounded, Timer} from "@material-ui/icons";

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
        padding: theme.spacing(2)
    },
    avatar: {
        margin: theme.spacing(2),
        width: "245px",
        height: "245px"
    }
}))

export default function CompletedOrdersClient(props) {
    console.log(props);
    const classes = useStyles();

    const card = (order) => {
        return (
            <Card className={classes.card}>
                <Paper className={classes.avatar}>
                    <CardMedia
                        style={{width: "250px", height: "250px"}}
                        component="img"
                        image="/logo_bot.png"
                    />
                </Paper>
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
                        <Typography component="div" variant="subtitle1">
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
                            {order.Order.datetime_of_walking.substr(order.Order.datetime_of_walking.indexOf("T")+1, 8)}
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
                    <Paper className={classes.paper}>
                        <Typography variant="subtitle1">
                            Статус: {order.Order.paid ? "Оплачен" : order.Order.walker_took_order == null ? "Нет ответа" : "Отказ"}
                        </Typography>
                    </Paper>
                </Box>
            </Card>
        )
    }

    return (
        <>
            {
                props.orders.map(order => (
                    card(order)
                ))
            }
        </>
    );
}
