import MailLockIcon from '@mui/icons-material/MailLock';
import { Typography, Box, Avatar, TextField, Button, Link, CircularProgress } from "@mui/material";
import Divider from '@mui/material/Divider';

import { useEffect } from 'react';
import { useContext } from 'react';
import { useState } from "react";
import { InitialPageContext } from '../../contexts/initial-page';
import { useFirstRender } from '../../hooks/useFirstRender';
import AboutUsLayout from '../AboutUsLayout';
import EmailSentModal from './EmailSentModal';
import { recoverPassword } from './recover-password.api';

const TEAL = '#6aabab';

export default function RecoverPassword() {
    const { setPageToRender } = useContext(InitialPageContext);
    const firstRender = useFirstRender();
    
    const [email, setEmail] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [requestingToApi, setRequestingToApi] = useState(false);
    const [isValidEmail, setIsValidEmail] = useState(true);

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
        setRequestingToApi(true);
        await recoverPassword(email);
        setOpenModal(true);
        } catch (err) {
            console.log(err);
        } finally {
            setRequestingToApi(false);
        }
    }

    const handleCloseModal = () => {
        setOpenModal(false);
        setPageToRender('signin')
    }

    useEffect(() => {
        if (firstRender) return;

        if (!email.includes('@')) {
            setIsValidEmail(false);
        } else {
            setIsValidEmail(true);
        }

    }, [email]);

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
                            <MailLockIcon />
                        </Avatar>
                    </Box>

                    {/* Title */}
                    <Typography
                        component="h1"
                        variant="h5"
                        sx={{ fontWeight: 'bold', textAlign: 'center', mb: 0.5, fontSize: '1.5em' }}
                    >
                        Recuperar senha
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', textAlign: 'center', mb: 3, fontSize: '0.9em' }}
                    >
                        Informe seu e-mail cadastrado para enviarmos as instruções de recuperação de senha.
                    </Typography>


                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        {/* Email field */}
                        <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, fontSize: 'inherit' }}>
                            Email *
                        </Typography>
                        <TextField
                            error={!isValidEmail}
                            inputProps={{ style: { fontSize: 'var(--base-font-size)' } }}
                            fullWidth
                            id="email"
                            placeholder="seu.email@ufam.edu.br"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            sx={{ mb: 2 }}
                            helperText={!isValidEmail ? 'Informe um e-mail válido' : ''}
                        />
                        {/* Submit button */}
                        <Button 
                            disabled={
                                requestingToApi ||
                                email.length === 0
                            }
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
                            startIcon={requestingToApi && <CircularProgress size={20} />}
                        >
                            Confirmar
                        </Button>
                        
                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" sx={{ textAlign: 'center', fontSize: 'inherit' }}>
                            <Link href="#" variant="body2" onClick={() => setPageToRender('signin')}>
                                Já possui uma conta? Faça login
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <EmailSentModal open={openModal} onClose={handleCloseModal}/>
        </AboutUsLayout>
    );
};