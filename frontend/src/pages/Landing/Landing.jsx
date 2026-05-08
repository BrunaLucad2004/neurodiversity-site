import {  Grid } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { /*useState,*/ useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import AboutUs from '../../components/AboutUs/AboutUs';
import Home from '../../components/AboutUs/Home/Home'
//import RecoverPassword from '../../components/RecoverPassword/RecoverPassword';
//import SignIn from '../../components/SignIn/SignIn';
//import SignUp from '../../components/SignUp/SignUp';
import { AuthContext } from '../../contexts/auth';
//import { InitialPageContext } from '../../contexts/initial-page';

const theme = createTheme();

export default function Landing() {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  //const [pageToRender, setPageToRender] = useState('signin');

  useEffect(() => {
    if (authenticated) {
      navigate('/arts/search', { replace: true });
    }
  }, [authenticated]);

  useEffect(() => {
    document.title = 'CEDOMCA | Início';
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main">
        <CssBaseline />
        <Grid item xs={12}>
          <Home/>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
