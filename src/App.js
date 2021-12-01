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
import Profile from "./profile/Profile";
import Edit from "./profile/Edit";
import AddDog from "./signup/AddDog";
import WalkerProfile from "./profile/WalkerProfile";


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
                <Route path='/profile' exact component={Profile}/>
                <Route path='/edit' exact component={Edit}/>
                <Route path='/add-dog' exact component={AddDog}/>
                <Route path= '/walkerprofile' exac component={WalkerProfile}/>
            </Switch>
            </Box>
        </>
    );
}

export default App;
