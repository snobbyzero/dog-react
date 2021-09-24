import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter as Router} from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { ThemeProvider } from '@material-ui/core/styles';
import muiTheme from './theme/muiTheme';
import CssBaseline from "@material-ui/core/CssBaseline";

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <ThemeProvider theme={muiTheme}>
                <CssBaseline/>
                <App/>
            </ThemeProvider>
        </Router>
    </React.StrictMode>,
    document.getElementById('root')
);

reportWebVitals();
