import {useState} from "react";
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

export default function CompletedOrdersWalker(props) {
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
                            Статус: ожидается оплата или ожидается подтверждение или оплачен
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
            {
                props.orders.map(order => (
                    card(order)
                ))
            }
        </>
    );
}