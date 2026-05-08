import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import LockIcon from '@mui/icons-material/Lock';

import { Typography, Container, CssBaseline, Box, Avatar, TextField, Button, List, ListItem, ListItemText, ListItemIcon, Alert } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect } from 'react';
import { useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFirstRender } from '../../hooks/useFirstRender';
import { ChangedPasswordModal } from './ChangedPasswordModal';
import { changePassword } from './change-password.api';

export const ChangePassword = () => {
    const firstRender = useFirstRender();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [doPasswordsMatch, setDoPasswordsMatch] = useState(false);
    const [isPasswordEmpty, setIsPasswordEmpty] = useState(false);
    const [isConfirmPasswordEmpty, setIsConfirmPasswordEmpty] = useState(false);
    const [isPasswordLengthLessThanLowerLimit, setIsPasswordLengthLessThanLowerLimit] = useState(true);
    const [isPasswordLengthGreaterThanUpperLimit, setIsPasswordLengthGreaterThanUpperLimit] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [requestingToApi, setRequestingToApi] = useState(false);

    const handleErrors = () => {
        setErrorMessage('');
        setIsPasswordEmpty(password === '');
        setIsConfirmPasswordEmpty(confirmPassword === '');
        setDoPasswordsMatch(password === confirmPassword && (password !== '' && confirmPassword !== ''));
        setIsPasswordLengthLessThanLowerLimit(password.length < 8);
        setIsPasswordLengthGreaterThanUpperLimit(password.length > 18);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        handleErrors();

        setRequestingToApi(true);
        const authKey = searchParams.get('authKey');
        try {
            await changePassword({ authKey, password });
            setOpenModal(true);
        } catch(err) {
            console.log(err)
            setErrorMessage('O link não é mais válido. Solicite uma nova recuperação de senha.');
        }
        setRequestingToApi(false);
    }

    useEffect(() => {
        if (firstRender) return;

        handleErrors();

    }, [password, confirmPassword]);

    const handleCloseModal = () => {
        setOpenModal(false);
        navigate('/', { replace: true });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Alterar senha
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        error={isPasswordEmpty}
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Nova senha"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        helperText={isPasswordEmpty ? 'A senha não pode ser vazia' : ''}
                    />
                    <TextField
                        error={isConfirmPasswordEmpty}
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirmar nova senha"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                        }}
                        helperText={isConfirmPasswordEmpty ? 'Confirme sua senha' : ''}
                    />
                    <List>
                        <ListItem>
                            <ListItemIcon>
                                {
                                    doPasswordsMatch ? <CheckCircleIcon color='success'/> : <ErrorIcon color='error'/>
                                }
                            </ListItemIcon>
                            <ListItemText 
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                                primary='As senhas devem ser iguais' />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                {
                                    isPasswordLengthLessThanLowerLimit ? <ErrorIcon color='error'/> : <CheckCircleIcon color='success'/>
                                }
                            </ListItemIcon>
                            <ListItemText 
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                                primary='A senha deve conter pelo menos 8 caracteres' />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                                {
                                    isPasswordLengthGreaterThanUpperLimit ? <ErrorIcon color='error'/> : <CheckCircleIcon color='success'/>
                                }
                            </ListItemIcon>
                            <ListItemText 
                                primaryTypographyProps={{
                                    variant: 'body2'
                                }}
                                primary='A senha deve conter no máximo 18 caracteres' />
                        </ListItem>
                    </List>
                    {
                        errorMessage && <Alert severity='warning'>{errorMessage}</Alert>
                    }
                    <Button 
                        disabled={
                            !doPasswordsMatch || 
                            isPasswordEmpty || 
                            isConfirmPasswordEmpty || 
                            isPasswordLengthLessThanLowerLimit || 
                            isPasswordLengthGreaterThanUpperLimit ||
                            requestingToApi
                        }
                        type="submit" 
                        fullWidth 
                        variant="contained" 
                        sx={{ mt: 3, mb: 2 }}
                        startIcon={requestingToApi && <CircularProgress size={20} />}
                    >
                        Confirmar
                    </Button>
                </Box>
            </Box>
            <ChangedPasswordModal open={openModal} onClose={handleCloseModal}/>
        </Container>
    );
};