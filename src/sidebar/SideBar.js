import Drawer from "@material-ui/core/Drawer";
import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import PetsIcon from '@material-ui/icons/Pets';
import PersonIcon from '@material-ui/icons/Person';
import MenuIcon from '@material-ui/icons/Menu';
import makeStyles from "@material-ui/core/styles/makeStyles";

const useStyles = makeStyles({
    paper: {
        width: 300
    }
});

export default function SideBar() {
    const classes = useStyles();

    const drawerWidth = 240;

    const links = [
        {"title": "Home", "icon": <PetsIcon/>},
        {"title": "Profile", "icon": <PersonIcon/>}
    ];

    const drawer = (
        <div>
            <Toolbar/>
            <Divider/>
            <List>
                {links.map(({title, icon}, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon>
                            {icon}
                        </ListItemIcon>
                        <ListItemText primary={title}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Box>
            <CssBaseline/>
            <AppBar position="sticky" style={{zIndex: 1251}}>
                <Toolbar>
                    <Typography variant="h6" noWrap component="div">
                        жЫвотные
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{paper: classes.paper}}
                style={{zIndex: 1250}}
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
