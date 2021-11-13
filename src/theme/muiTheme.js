import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: '#C5E1A5',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#899d73',
            contrastText: '#ffffff'
        },
    }
});
theme = responsiveFontSizes(theme);


export default theme;
