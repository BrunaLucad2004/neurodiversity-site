import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
//import Container from '@mui/material/Container';

import Divider from '@mui/material/Divider';
//import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { City, Country, State } from 'country-state-city';

import { useState } from 'react';
import * as React from 'react';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { InitialPageContext } from '../../contexts/initial-page';
import { createUser } from '../../services/api';
import AboutUsLayout from '../AboutUsLayout';
import SignedUpModal from './SignedUpModal';


//const theme = createTheme();
const TEAL = '#6aabab';

export default function SignUp() {
  const { setPageToRender } = useContext(InitialPageContext);
  const role = 'visitor';
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [open, setOpen] = React.useState(false);
  const [show, setShow] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const cities = selectedCountry && selectedState
    ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode)
    : [];
  const [openModal, setOpenModal] = useState(false);

  const navigate = useNavigate();

  const { authenticated } = React.useContext(AuthContext);
  React.useEffect(() => {
    if (authenticated) {
      navigate('/arts/search', { replace: true });
    }
  }, [authenticated]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setPageToRender('signin');
  };

  const setField = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const findFormErrors = () => {
    const { name, email, password, confirmPassword, birthDate, country, state, city } = form;
    const newErrors = {};
    // name errors
    if (!name || name === '') newErrors.name = 'Nome obrigatório';
    // rating errors
    if (!email || email === '') newErrors.email = 'Email obrigatório';
    else if (!email.includes('@')) newErrors.email = 'Email inválido';
    // birthDate errors
    if (!birthDate) newErrors.birthDate = 'Data de nascimento obrigatória';
    // location errors
    if (!country || country === '') newErrors.country = 'País obrigatório';
    if (!state || state === '') newErrors.state = 'Estado obrigatório';
    if (!city || city === '') newErrors.city = 'Cidade obrigatória';
    // comment errors
    if (!password || password === '') newErrors.password = 'Senha obrigatório';
    else if (password.length > 18)
      newErrors.password = 'Senha muito longa! Sua senha deve conter entre 8 e 18 caracteres';
    else if (password.length < 8)
      newErrors.password = 'Senha muito curta! Sua senha deve conter entre 8 e 18 caracteres';

    if (!confirmPassword || confirmPassword === '')
      newErrors.confirmPassword = 'Confirmar senha obrigatório';
    else if (confirmPassword !== password) newErrors.confirmPassword = 'As senhas devem ser igual';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log(newErrors);
    } else {
      setOpen(true);
      const options = {
        fullName: form.name,
        birthDate: form.birthDate,
        email: form.email,
        password: form.password,
        country: form.country,
        state: form.state,
        city: form.city,
        role,
      };
      try {
        await createUser(options);
        setOpen(false);
        setOpenModal(true);
      } catch (err) {
        setOpen(false);
        console.log(err);
        setShow(true);
        let errorMsg = err.response.data.message.toString();
        let newErrorMsg = errorMsg.replaceAll(',', '\n\n');
        setMessage(newErrorMsg);
        setTimeout(function () {
          setShow(false);
        }, 7000);
      }
    }
  };

  return (
    <AboutUsLayout onLoginClick={() => setPageToRender('signin')}>
      <Box
        sx={{
          minHeight: 'calc(100vh - 120px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          py: 4,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 560,
            bgcolor: '#fff',
            borderRadius: 3,
            boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
            p: '40px',
            fontSize: 'var(--base-font-size)',
          }}
        >
          {/* Avatar */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: TEAL, width: 64, height: 64 }}>
              <PersonAddAltOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 0.5, fontSize: '1.5em' }}
          >
            Cadastre-se
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center', mb: 3, fontSize: '0.9em' }}
          >
            Crie sua conta para acessar o sistema
          </Typography>

          <Collapse in={show}>
            <Alert severity="error">
              <p>{message}</p>
            </Alert>
          </Collapse>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Name field */}
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
              Nome Completo *
            </Typography>
            <TextField
              autoComplete="given-name"
              name="fullName"
              fullWidth
              id="fullName"
              placeholder="Seu nome completo"
              onChange={(e) => setField('name', e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              {...(errors.name && { error: true, helperText: errors.name })}
            />

            {/* Email field */}
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
              Email *
            </Typography>
            <TextField
              fullWidth
              id="email"
              placeholder="seu.email@ufam.edu.br"
              name="email"
              onChange={(e) => setField('email', e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              {...(errors.email && { error: true, helperText: errors.email })}
            />
            
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
              Data de Nascimento *
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                inputFormat="DD/MM/YYYY"
                value={form.birthDate ?? null}
                onChange={(e) => setField('birthDate', e)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    sx={{ mb: 2 }}
                    inputProps={{ ...params.inputProps, placeholder: 'dd/mm/aaaa', style: { fontSize: 'var(--base-font-size)' } }}
                    {...(errors.birthDate && { error: true, helperText: errors.birthDate })}
                  />
                )}
              />
            </LocalizationProvider>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                  País *
                </Typography>
                <Autocomplete
                  options={countries}
                  getOptionLabel={(option) => option.name}
                  value={selectedCountry}
                  onChange={(_, newValue) => {
                    setSelectedCountry(newValue);
                    setSelectedState(null);
                    setField('country', newValue ? newValue.name : '');
                    setField('state', '');
                    setField('city', '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Brasil"
                      inputProps={{ ...params.inputProps, style: { fontSize: 'var(--base-font-size)' } }}
                      error={!!errors.country}
                      helperText={errors.country}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                  Estado *
                </Typography>
                <Autocomplete
                  options={states}
                  getOptionLabel={(option) => option.name}
                  value={selectedState}
                  noOptionsText={!selectedCountry ? 'Selecione um país primeiro' : 'Nenhum estado encontrado'}
                  onChange={(_, newValue) => {
                    setSelectedState(newValue);
                    setField('state', newValue ? newValue.name : '');
                    setField('city', '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="SP"
                      inputProps={{ ...params.inputProps, style: { fontSize: 'var(--base-font-size)' } }}
                      error={!!errors.state}
                      helperText={errors.state}
                    />
                  )}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                  Cidade *
                </Typography>
                <Autocomplete
                  options={cities}
                  getOptionLabel={(option) => option.name}
                  value={cities.find((c) => c.name === form.city) ?? null}
                  noOptionsText={!selectedState ? 'Selecione um estado primeiro' : 'Nenhuma cidade encontrada'}
                  onChange={(_, newValue) => {
                    setField('city', newValue ? newValue.name : '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      placeholder="Araraquara"
                      inputProps={{ ...params.inputProps, style: { fontSize: 'var(--base-font-size)' } }}
                      error={!!errors.city}
                      helperText={errors.city}
                    />
                  )}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                  Senha *
                </Typography>
                <TextField
                  fullWidth
                  name="password"
                  type="password"
                  id="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
                  onChange={(e) => setField('password', e.target.value)}
                  inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
                  {...(errors.password && { error: true, helperText: errors.password })}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                  Confirmação de Senha *
                </Typography>
                <TextField
                  fullWidth
                  name="confirmPassword"
                  type="password"
                  id="confirmPassword"
                  placeholder="••••••••"
                  onChange={(e) => setField('confirmPassword', e.target.value)}
                  inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
                  {...(errors.confirmPassword && { error: true, helperText: errors.confirmPassword })}
                />
              </Box>
            </Box>

            {/* Submit button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: TEAL,
                color: '#fff',
                fontWeight: 'bold',
                py: 1.2,
                fontSize: 'inherit',
                '&:hover': { bgcolor: '#5a9898' },
              }}
            >
              Criar Conta
            </Button>

            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body2" sx={{ textAlign: 'center', fontSize: 'inherit' }}>
              Já tem uma conta?{' '}
              <Link
                href="#"
                onClick={() => setPageToRender('signin')}
                sx={{ color: TEAL, fontWeight: 500, textDecorationColor: TEAL }}
              >
                Fazer Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
      <SignedUpModal open={openModal} onClose={handleCloseModal} />
    </AboutUsLayout>
  );
}
