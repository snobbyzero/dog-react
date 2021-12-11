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
        flexDirection: "column",
        margin: theme.spacing(2),
    },
    box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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

export default function WaitingResponseOrdersClient(props) {
    console.log(props);
    const classes = useStyles();

    const card = (order) => {
        console.log(order)
        return (
            <Card className={classes.card}>
                <Box className={classes.box}>
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
                                {order.Dog.date_of_birth}, {order.Dog.size_in_kg}
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
                                {order.Order.datetime_of_walking}
                            </Typography>
                            <Typography variant="subtitle1" style={{display: "flex", alignItems: "center"}}>
                                <Timer style={{marginLeft: "-3px", marginRight: "3px"}}/>
                                {order.Order.numbers_of_hours}
                            </Typography>
                            <div style={{display: "flex"}}>
                                <Typography variant="subtitle1" style={{marginLeft: "3px", marginRight: "10px"}}>
                                    ₽
                                </Typography>
                                <Typography variant="subtitle1">
                                    {order.Order.price}
                                </Typography>
                            </div>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle1">
                                Статус: ожидает ответа
                            </Typography>
                        </Paper>
                        <Paper className={classes.paper}>
                            <Typography variant="subtitle1" style={{cursor: "pointer"}}>
                                Подробнее
                            </Typography>
                        </Paper>

                    </Box>
                </Box>
                <CardActions>
                    <Button>Принять</Button>
                    <Button>Отклонить</Button>
                </CardActions>
            </Card>
        )
    }
// TODO если client_confirmed_execution == null, то будет кнопка подтвердить и отклонить
// TODO если client_confirmed_execution == true, то будет кнопка оплатить
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
