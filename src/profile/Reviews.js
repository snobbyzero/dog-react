import {makeStyles, Paper, Typography} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import {Star} from "@material-ui/icons";
import React, {useEffect, useState} from "react";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
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
    review: {
        marginBottom: theme.spacing(2),
        padding: theme.spacing(1),
        display: "flex",
        flexDirection: "column",
        width: "300px"
    },
}))
export default function Reviews(props) {
    const classes = useStyles();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        console.log(props.id)
        axios.get("https://fast-api-walking-v1.herokuapp.com/order/reviews?walker_user_id="+parseInt(props.id))
            .then(async res => {
                console.log(await res)
                await Promise.all(res.data.map(async review => {
                    await axios.get("https://fast-api-walking-v1.herokuapp.com/user/?id=" + review.client_id)
                        .then(response => {
                            res.data.name = response.data.name;
                        })
                }))
                setReviews(res.data)
            })
    }, [])

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", alignItems: "center"}}>
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
        ))}
        </Box>
    )
}
