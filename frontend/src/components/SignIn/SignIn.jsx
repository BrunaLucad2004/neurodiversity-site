import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { InitialPageContext } from '../../contexts/initial-page';
import { createSession } from '../../services/api';
import AboutUsLayout from '../AboutUsLayout';

const TEAL = '#6aabab';

export default function SignIn() {
  const { setPageToRender } = useContext(InitialPageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { authenticated, setId, setRole } = useContext(AuthContext);
  const [errors, setErrors] = useState({});

  const findFormErrors = () => {
    const newErrors = {};
    if (!email || email === '') newErrors.email = 'Email obrigatório';
    else if (!email.includes('@')) newErrors.email = 'Email inválido';
    if (!password || password === '') newErrors.password = 'Senha obrigatório';
    else if (password.length > 18)
      newErrors.password = 'Senha muito longa! Sua senha deve conter entre 8 e 18 caracteres';
    else if (password.length < 8)
      newErrors.password = 'Senha muito curta! Sua senha deve conter entre 8 e 18 caracteres';
    return newErrors;
  };

  useEffect(() => {
    if (authenticated) {
      navigate('/arts/search', { replace: true });
    }
  }, [authenticated]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        setOpen(true);
        const response = await createSession(email, password);
        sessionStorage.setItem('connect.sid', response.data.id);
        sessionStorage.setItem('connect.srole', response.data.role);
        setId(response.data.id);
        setRole(response.data.role);
        setOpen(false);
        navigate('/arts/search', { replace: true });
      } catch (err) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        }
        setOpen(false);
      }
    }
  };

  return (
    <AboutUsLayout activePage="login">
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
            maxWidth: 420,
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
              <LockOutlinedIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>

          {/* Title */}
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 'bold', textAlign: 'center', mb: 0.5, fontSize: '1.5em' }}
          >
            Fazer Login
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', textAlign: 'center', mb: 3, fontSize: '0.9em' }}
          >
            Acesse o sistema de gerenciamento do acervo
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {/* Email field */}
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
              E-mail *
            </Typography>
            <TextField
              fullWidth
              id="email"
              name="email"
              autoComplete="email"
              placeholder="seu.email@ufam.edu.br"
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              FormHelperTextProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              {...(errors.email && { error: true, helperText: errors.email })}
            />

            {/* Password field */}
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
              Senha *
            </Typography>
            <TextField
              fullWidth
              name="password"
              type="password"
              id="password"
              autoComplete="current-password"
              placeholder="••••••••"
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 1 }}
              inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              FormHelperTextProps={{ style: { fontSize: 'var(--base-font-size)' } }}
              {...(errors.password && { error: true, helperText: errors.password })}
            />

            {/* Forgot password */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Typography
                component="a"
                href="#"
                onClick={(e) => { e.preventDefault(); setPageToRender('recover-password'); }}
                sx={{ color: TEAL, textDecoration: 'none', cursor: 'pointer', fontSize: 'inherit', '&:hover': { textDecoration: 'underline' } }}
              >
                Esqueceu a senha?
              </Typography>
            </Box>

            {error && <Alert severity="warning" sx={{ mb: 2, fontSize: 'inherit' }}>{error}</Alert>}

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
              Entrar
            </Button>

            <Backdrop
              sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={open}
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <Divider sx={{ my: 3 }} />

            {/* Sign up link */}
            <Typography sx={{ textAlign: 'center', color: 'text.secondary', fontSize: 'inherit' }}>
              Não tem acesso ao sistema?{' '}
              <Typography
                component="a"
                href="#"
                onClick={(e) => { e.preventDefault(); setPageToRender('signup'); }}
                sx={{
                  color: TEAL,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: 'inherit',
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Cadastre-se
              </Typography>
            </Typography>
          </Box>
        </Box>
      </Box>
    </AboutUsLayout>
  );
}