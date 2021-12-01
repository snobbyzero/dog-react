import React, {useRef, useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {Typography} from "@material-ui/core";
import {Add, Photo} from "@material-ui/icons";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {DatePicker, DateTimePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';


const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex"
    },
    paper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "300px",
        height: "150px",
        cursor: "pointer",
        margin: theme.spacing(2)
    },
    img: {
        width: "100px",
        height: "100px",
        margin: theme.spacing(2)
    },
    dog_information: {
        display: "flex",
        flexDirection: "column",
        alignItems: "space-between"
    },
    text: {
        margin: theme.spacing(1)
    },
    avatar: {
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        cursor: "pointer"
    },
    add_photo_box: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "130px",
        height: "130px",
        borderRadius: "50%",
        cursor: "pointer",
        border: "solid 5px",
        borderColor: theme.palette.primary.main
    },
    add_photo: {
        width: "65px",
        height: "65px",
        color: theme.palette.primary.main
    }
}))
export default function DogsCards(props) {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [avatarPicked, setAvatarPicked] = useState(false);
    const [avatar, setAvatar] = useState();
    const [nickname, setNickname] = useState("");
    const [breed, setBreed] = useState("");
    const [size, setSize] = useState(0);
    const [birth, setBirth] = useState(Date.now);
    const hiddenAvatarInput = useRef();

    const handleClose = () => {
        setOpen(false);
        setAvatar(null);
        setNickname("");
        setBreed("");
        setSize(0);
        setBirth(Date.now());
    };

    const addNewDog = () => {
        setOpen(true);
    }

    const changeDog = (dog) => {
        setOpen(true);

        setAvatar(dog.avatar)
        setNickname(dog.nickname);
        setBreed(dog.breed);
        setSize(dog.size_in_kg);
        setBirth(dog.date_of_birth);
    }

    const saveDog = () => {
        setOpen(false);
        console.log(avatar)
        console.log(nickname)
        console.log(breed)
        console.log(size)
        console.log(birth)
    }

    const handleAvatarChange = (event) => {
        if (event.target.files[0] != null) {
            setAvatar(event.target.files[0]);
            setAvatarPicked(true);
        }
    }

    return (
        <Box className={classes.root}>
        {
            props.dogs.map(dog => (
                <Paper className={classes.paper} onClick={(dog) => changeDog(dog)}>
                    <img className={classes.img} src={dog.image} alt="dog img"/>
                    <Box className={classes.dog_information}>
                        <Typography className={classes.text}>{dog.nickname}</Typography>
                        <Typography className={classes.text}>{dog.breed}</Typography>
                        <Typography className={classes.text}>{dog.size_in_kg}</Typography>
                        <Typography className={classes.text}>{dog.date_of_birth}</Typography>
                    </Box>
                </Paper>
            ))
        }
        <Paper className={classes.paper} onClick={() => addNewDog()}>
            <Typography>Добавить собаку</Typography>
            <Add/>
        </Paper>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle style={{width: "100%", textAlign: "center"}}>Добавить собаку</DialogTitle>
                <DialogContent style={{display: "flex", flexDirection: "column", alignItems: "center", width: "400px"}}>
                    { avatarPicked ?
                        <img className={classes.avatar} alt="avatar" onClick={() => hiddenAvatarInput.current.click()}
                             src={avatarPicked && avatar && URL.createObjectURL(avatar)}/>
                        :
                        <Box className={classes.add_photo_box} onClick={() => hiddenAvatarInput.current.click()}>
                            <Photo className={classes.add_photo}/>
                        </Box>
                    }
                    <input
                        accept="image/*"
                        type="file"
                        id="avatar"
                        hidden
                        ref={hiddenAvatarInput}
                        onChange={handleAvatarChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        label="Кличка"
                        autoFocus
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        label="Порода"
                        autoFocus
                        value={breed}
                        onChange={(e) => setBreed(e.target.value)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        label="Вес (кг)"
                        autoFocus
                        type="number"
                        value={size}
                        onChange={(e) => setSize(parseInt(e.target.value))}
                    />
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Box style={{display: "flex", justifyContent: "space-between", cursor: "pointer"}}>
                            <DatePicker
                                margin="normal"
                                className={classes.date}
                                label="Дата рождения"
                                inputVariant="outlined"
                                value={birth}
                                onChange={(date) => setBirth(date)}
                            />
                        </Box>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Отмена</Button>
                    <Button variant="contained" color="secondary" onClick={saveDog}>Ок</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
