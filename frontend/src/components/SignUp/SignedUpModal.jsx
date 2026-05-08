import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';

export default function SignedUpModal({ open, onClose }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction='row' alignItems='center' spacing={3}>
                    <CheckCircleIcon color='success'/>
                    <Typography variant='h6'>Sua conta foi criada com sucesso!</Typography> 
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Typography component='p' variant='body1'>
                    Faça login com e-mail e senha cadastrados para ter acesso ao nosso acervo.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Voltar para a página inicial
                </Button>
            </DialogActions>
        </Dialog>
    )
}; 