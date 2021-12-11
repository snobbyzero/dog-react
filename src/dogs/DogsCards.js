import React, {useEffect, useRef, useState} from "react";
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
import axios from "axios";
import {getAccessToken} from "../utils/auth";


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
        alignItems: "space-around",
        margin: theme.spacing(2)
    },
    text: {
        margin: theme.spacing(1),
        marginBottom: theme.spacing(1/2),
        marginTop: theme.spacing(1/2),
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
export default function DogsCards() {
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const [avatarPicked, setAvatarPicked] = useState(false);
    const [avatar, setAvatar] = useState();
    const [nickname, setNickname] = useState("");
    const [breed, setBreed] = useState("");
    const [size, setSize] = useState(0);
    const [birth, setBirth] = useState(Date.now);
    const hiddenAvatarInput = useRef();
    const [dogs, setDogs] = useState([]);

    useEffect(() => {
        const getDogs = async () => {
            axios.get("https://fast-api-walking-v1.herokuapp.com/dog/all", {
                headers: {
                    "Authorization": `Bearer ${await getAccessToken()}`
                }
            })
                .then(res => {
                    console.log("dogs");
                    console.log(res.data);
                    setDogs(res.data);
                })
        }
        getDogs()
    }, [])

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
        console.log(dog)
        //setAvatar(dog.avatar)
        setNickname(dog.nickname);
        setBreed(dog.breed);
        setSize(dog.size_in_kg);
        setBirth(dog.date_of_birth);
    }

    const saveDog = async () => {
        setOpen(false);
        axios.post("https://fast-api-walking-v1.herokuapp.com/dog", {
            breed: breed,
            nickname: nickname,
            size_in_kg: size,
            date_of_birth: birth
        }, {
            headers: {
                "Authorization": `Bearer ${await getAccessToken()}`
            }
        }).then(async res => {
            console.log("DOG: ")
            console.log(res.data)

            setDogs([...dogs, res.data])
            if (avatar) {
                const id = res.data['id'];
                const formData = new FormData();
                formData.append('image', avatar);
                console.log(await getAccessToken())
                axios.post("https://fast-api-walking-v1.herokuapp.com/dog/avatar?id=" + id, formData, {
                    headers: {
                        "Authorization": `Bearer ${await getAccessToken()}`
                    }
                })
                    .then(response => {
                        console.log("DOG AVATAR:")
                        console.log(response)
                        setDogs([...dogs, response.data])
                    })
            }
        })
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
            dogs.map(dog => (
                <Paper className={classes.paper} onClick={(e) => {changeDog(dog)}}>
                    <img className={classes.img} src={dog.image} alt="dog img"/>
                    <Box className={classes.dog_information}>
                        <Typography className={classes.text}>Кличка: {dog.nickname}</Typography>
                        <Typography className={classes.text}>Порода: {dog.breed}</Typography>
                        <Typography className={classes.text}>Вес: {dog.size_in_kg} кг</Typography>
                        <Typography className={classes.text}>ДР: {dog.date_of_birth.substr(0, dog.date_of_birth.indexOf('T'))}</Typography>
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
