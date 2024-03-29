import {useState} from "react";
import {
    Card,
    CardMedia, Divider,
    Paper,
    Typography
} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Timer} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
    card: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
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

export default function ActiveOrdersClient(props) {
    console.log(props);
    const classes = useStyles();
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1)

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
                            Имя собаки
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            Возраст, вес
                        </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography component="div" variant="subtitle1">
                            Контактная информация
                        </Typography>
                        <Divider/>
                        <Typography component="div" variant="subtitle1">
                            Имя клиента
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            Телефон
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" component="div">
                            Почта
                        </Typography>
                    </Paper>
                </Box>
                <Box style={{display: "flex", flexDirection: "column", justifyContent: "space-around"}}>
                    <Paper className={classes.paper}>
                        <Typography variant="subtitle1">
                            Время: 15:47
                        </Typography>
                        <Typography variant="subtitle1" style={{display: "flex", alignItems: "center"}}>
                            <Timer style={{marginLeft: "-3px", marginRight: "3px"}}/>
                            3 часа
                        </Typography>
                        <div style={{display: "flex"}}>
                            <Typography variant="subtitle1" style={{marginLeft: "3px", marginRight: "10px"}}>
                                ₽
                            </Typography>
                            <Typography variant="subtitle1">
                                5000
                            </Typography>
                        </div>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="subtitle1">
                            Статус: активный
                        </Typography>
                    </Paper>
                    <Paper className={classes.paper}>
                        <Typography variant="subtitle1" style={{cursor: "pointer"}}>
                            Подробнее
                        </Typography>
                    </Paper>

                </Box>
            </Card>
        )
    }

    return (
        <>
            <Typography variant="h2">Сегодня</Typography>

            {props.orders.map(order =>
                (
                    order.datetime_of_walking.substring(0, 10) === today.toISOString().substring(0, 10) &&
                    card(order)
                )
            )
            }
            <Typography variant="h2">Завтра</Typography>
            {
                props.orders.map(order => (
                    order.datetime_of_walking.substring(0, 10) === tomorrow.toISOString().substring(0, 10) &&
                    card(order)
                ))
            }
            <Typography variant="h2">Остальные</Typography>
            {
                props.orders.map(order => (
                    order.datetime_of_walking.substring(0, 10) > tomorrow.toISOString().substring(0, 10) &&
                    card(order)
                ))
            }
        </>
    );
}