import React, {useEffect, useState} from "react";
import {AppBar, List, ListItem, makeStyles, Paper, Typography, withStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import {useHistory} from 'react-router-dom';
import axios from "axios";
import Chip from "@material-ui/core/Chip";
import {Star} from "@material-ui/icons";
import SendDialog from "../home/SendDialog";

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
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: "300px"
    },
    user: {
        display: "flex",
        alignItems: "flex-start",
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
    },
    chips: {
        marginTop: theme.spacing(1)
    }
}))

export default function WalkerProfile(props) {
    const classes = useStyles();
    const [walkerInfo, setWalkerInfo] = useState("");
    const history = useHistory();
    const [reviews, setReviews] = useState([]);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        axios.get("https://fast-api-walking-v1.herokuapp.com/walker/?id=" + props.match.params.id)
            .then(async res => {
                res.data.Walker.stations = await Promise.all(res.data.Walker.stations.map(async station => {
                    return {value: station, color: await getColor(station)};
                }))
                setWalkerInfo(res.data);
            })

        axios.get("https://fast-api-walking-v1.herokuapp.com/order/reviews?walker_user_id=" + props.match.params.id)
            .then(async res => {
                await Promise.all(res.data.map(async review => {
                    await axios.get("https://fast-api-walking-v1.herokuapp.com/user/?id=" + review.client_id)
                        .then(response => {
                            res.data.name = response.data.name;
                        })
                }))
                console.log(res.data)
                setReviews(res.data)
            })
    }, [])


    const getColor = async (station) => {
        const res = await axios.post(
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/metro",
            {
                city: "Москва",
                query: station
            },
            {
                headers: {
                    "Authorization": "Token decae9911b8941c8e21ebd533d365620829cf431"
                }
            })
        if (res.data.suggestions && res.data.suggestions.length > 0) {
            return "#" + res.data.suggestions[0].data.color
        } else {
            return "white"
        }
    }

    return (
        <>
            {
                walkerInfo ?
                    <Box className={classes.root}>
                        <Box className={classes.user}>
                            <img className={classes.avatar} src={classes.userInfo.avatar_url}/>
                            <Box style={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                height: "250px"
                            }}>
                                <Box className={classes.userInfo}>
                                    <Box style={{display: "flex", alignItems: "center"}}>
                                        <Box style={{display: "flex", marginRight: "10px", alignItems: "center"}}>
                                            <Star fontSize="medium" style={{color: "#FFCD3C"}}/>
                                            <Typography variant="h6">{walkerInfo.Walker.rating}</Typography>
                                        </Box>
                                        <Typography variant="h4">{walkerInfo.User.name}</Typography>
                                    </Box>
                                    <Typography variant="h6">Почта: {walkerInfo.User.email}</Typography>
                                    <Typography variant="h6">Тел. номер: {walkerInfo.User.phone_number}</Typography>
                                    <Box className={classes.chips}>
                                    {walkerInfo.Walker.stations.length > 0 ?
                                        walkerInfo.Walker.stations.map(station => (
                                            <Chip style={{background: station.color, color: "white"}}
                                                  className={classes.station}
                                                  label={station.value}/>
                                        ))
                                        :
                                        <Chip label="Любая станция" className={classes.station}
                                              style={{color: "white", background: "#008080"}}/>

                                    }
                                    </Box>
                                </Box>
                                <Button
                                    type="submit"
                                    fullWidth
                                    size="large"
                                    variant="contained"
                                    color="primary"
                                    className={classes.sendButton}
                                    onClick={() => setOpen(true)}
                                >
                                    Связаться
                                </Button>
                            </Box>
                        </Box>
                        <Box style={{marginTop: "20px"}}>
                            <Typography variant="h6">Расписание выгульщика</Typography>
                            <Typography style={{marginBottom: "20px"}}>
                                {walkerInfo.Walker.schedule}
                            </Typography>
                            <Typography variant="h6">О себе</Typography>
                            <Typography style={{marginBottom: "20px"}}>
                                {walkerInfo.Walker.about_walker}
                            </Typography>
                            <Box>
                                <Typography variant="h6"> Отзывы </Typography>
                                {
                                    reviews.map(review => (
                                        <Paper className={classes.review}>
                                            <Box style={{display: "flex", alignItems: "center"}}>
                                                <img className={classes.walkerImage}
                                                     src="https://upload.wikimedia.org/wikipedia/ru/thumb/4/4d/Wojak.png/200px-Wojak.png"/>
                                                <Box style={{display: "flex", alignItems: "center", justifyContent: "space-between", flexGrow: 1}}>
                                                     <Typography style={{overflow: "hidden", whiteSpace: "wrap", textOverflow: "ellipsis", flexGrow: 1}}>
                                                         {review.name}
                                                     </Typography>
                                                    <Box style={{display: "flex", marginRight: "10px", alignItems: "center"}}>
                                                        <Star style={{color: "#FFCD3C"}}/>
                                                        <Typography>{review.rating ? review.rating : 0}</Typography>
                                                    </Box>
                                                </Box>
                                            </Box>
                                            <Typography className={classes.reviewText}>{review.review}</Typography>
                                        </Paper>
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                    :
                    <></>
            }

            <SendDialog open={open} setOpen={setOpen} id={props.match.params.id}/>
        </>
    );

}
