import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

export const ChangedPasswordModal = (props) => {
    const { open, onClose } = props;
    
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <Stack direction='row' alignItems='center' spacing={3}>
                    <CheckCircleIcon color='success'/>
                    <Typography variant='h6'>Senha alterada com sucesso!</Typography> 
                </Stack>
            </DialogTitle>
            <DialogContent>
                <Typography component='p' variant='body1'>
                    A sua senha foi alterada com sucesso. Faça login novamente para continuar.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} component={Link} to='/signin'>
                    Voltar para a página inicial
                </Button>
            </DialogActions>
        </Dialog>
    )
}; 