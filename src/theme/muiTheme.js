import { createTheme, responsiveFontSizes } from '@material-ui/core/styles';

let theme = createTheme({
    palette: {
        primary: {
            main: '#ff9800',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#ffc400',
            contrastText: '#ffffff'
        }
    }
});
theme = responsiveFontSizes(theme);


export default theme;
