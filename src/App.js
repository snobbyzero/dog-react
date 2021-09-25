import React, {useEffect} from "react";
import {
    Switch,
    Route,
    useLocation
} from "react-router-dom";
import SideBar from "./sidebar/SideBar";
import Home from "./home/Home";
import SignIn from "./signin/SignIn";
import SignUp from "./signup/SignUp";
import Box from "@material-ui/core/Box";


function App() {
    const pathname = useLocation().pathname;
    const noHeaderArr = ['/signin', '/signup']

    return (
        <>
            {
                !noHeaderArr.includes(pathname) ? <SideBar/> : null
            }
            <Box style={{marginLeft: 300}}>
            <Switch>
                <Route path='/' exact component={Home}/>
                <Route path='/signin' exact component={SignIn}/>
                <Route path='/signup' exact component={SignUp}/>
            </Switch>
            </Box>
        </>
    );
}

export default App;
