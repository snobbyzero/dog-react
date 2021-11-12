import React, {useEffect} from "react";
import {
    Switch,
    Route,
    useLocation
} from "react-router-dom";
import Home from "./home/Home";
import SignIn from "./signin/SignIn";
import SignUp from "./signup/SignUp";
import Box from "@material-ui/core/Box";
import Header from "./header/Header";


function App() {
    const pathname = useLocation().pathname;
    const noHeaderArr = ['/signin', '/signup']

    return (
        <>
            {
                !noHeaderArr.includes(pathname) ? <Header/> : null
            }
            <Box>
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
