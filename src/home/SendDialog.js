import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Box from "@material-ui/core/Box";
import {Adjust, Photo} from "@material-ui/icons";
import TextField from "@material-ui/core/TextField";
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import React, {useEffect, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import {Typography} from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import axios from "axios";
import {getAccessToken} from "../utils/auth";

const useStyles = makeStyles((theme) => ({}))
export default function SendDialog() {
    const classes = useStyles();
    const [datetimeOfWalking, setDatetimeOfWalking] = useState(Date.now());
    const [numberOfHours, setNumberOfHours] = useState(1);
    const [description, setDescription] = useState("");
    const [dog, setDog] = useState();
    const [dogs, setDogs] = useState([]);

    const handleClose = () => {
        setOpen(false);
    }

    const sendButtonClick = async () => {
        axios.post("https://fast-api-walking-v1.herokuapp.com/dog/all?walker_user_id=" + props.id + "&dog_id=" + dog.id, {
            "datetime_of_walking": datetimeOfWalking,
            "numbers_of_hours": numberOfHours,
            "description": description
        }, {
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`
            }
        })
            .then(res => console.log(res.data));
    }

    useEffect(() => {
        const getDogs = async() => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/dog/all", {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    setDogs(res.data);
                })
        }
        getDogs()
    })



    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle style={{width: "100%", textAlign: "center"}}>Отправить заявку</DialogTitle>
            <DialogContent style={{display: "flex", flexDirection: "column", alignItems: "center", width: "400px"}}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Box style={{display: "flex", justifyContent: "space-between", cursor: "pointer"}}>
                        <DatePicker
                            margin="normal"
                            className={classes.date}
                            label="Дата прогулки"
                            inputVariant="outlined"
                            value={datetimeOfWalking}
                            onChange={(date) => setDatetimeOfWalking(date)}
                        />
                    </Box>
                </MuiPickersUtilsProvider>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Количество часов"
                    autoFocus
                    value={numberOfHours}
                    onChange={(e) => setNumberOfHours(e.target.value)}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    label="Заметка"
                    autoFocus
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Собака</InputLabel>
                    <Select
                        value={dog}
                        label="Собака"
                        onChange={setDog}
                    >
                        {
                            dogs.map(dog => (
                                <MenuItem value={dog}>{dog.nickname}</MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="secondary" onClick={handleClose}>Отмена</Button>
                <Button variant="contained" color="secondary" onClick={sendButtonClick}>Ок</Button>
            </DialogActions>
        </Dialog>
    );
}
