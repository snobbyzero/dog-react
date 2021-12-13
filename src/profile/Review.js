import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React, {useState} from "react";
import axios from "axios";
import {getAccessToken} from "../utils/auth";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Slider from "@material-ui/core/Slider";
import Rating from "@material-ui/lab/Rating";

const useStyles = makeStyles((theme) => ({

}))
export default function Review(props) {
    const classes = useStyles();

    const [review, setReview] = useState("")
    const [rating, setRating] = useState(5.0)

    const handleClose = () => {
        props.setOpen(false);
    }

    const sendButtonClick = async () => {
        axios.patch("https://fast-api-walking-v1.herokuapp.com/order/?order_id=" + props.id, {
            review: review,
            rating: rating,
            walker_took_order: true,
            client_confirmed_execution: true,
            paid: true
        }, {
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`
            }
        })
            .then(res => {
                props.setOpen(false)
                props.onPayClosed()
                console.log(res.data)
            });
    }


    return (
        <Dialog open={props.open} onClose={handleClose}>
            <DialogTitle style={{width: "100%", textAlign: "center"}}>Отправить отзыв</DialogTitle>
            <DialogContent style={{display: "flex", flexDirection: "column", alignItems: "center", width: "400px"}}>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    label="Отзыв"
                    rows={5}
                    multiline
                    autoFocus
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                />
                <Rating
                    size="large"
                    defaultValue={5.0}
                    precision={0.5}
                    value={rating}
                    valueLabelDisplay="on"
                    onChange={(e, newValue) => {
                        console.log(rating)
                        setRating(parseFloat(newValue))
                    }}
                />
            </DialogContent>
            <DialogActions style={{marginRight: "16px"}}>
                <Button className={classes.cancelButton} variant="contained" color="secondary" onClick={handleClose}>Отмена</Button>
                <Button className={classes.okButton} variant="contained" color="secondary" onClick={sendButtonClick}>Отправить</Button>
            </DialogActions>
        </Dialog>
    )
}
