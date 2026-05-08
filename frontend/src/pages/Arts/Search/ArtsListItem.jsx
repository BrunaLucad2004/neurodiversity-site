import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, capitalize, Chip, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const ArtsListItem = ({ art, editMode, onEdit, onDelete }) => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e0e0e0',
                p: 2,
                mb: 1.5,
                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.10)' },
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box
                    onClick={() => navigate(`/arts/${art.id}`)}
                    sx={{ cursor: 'pointer', flex: 1 }}
                >
                    <Typography
                        variant='caption'
                        sx={{ color: '#5f7a72', fontWeight: 600, letterSpacing: 0.5 }}
                    >
                        {art.code}
                    </Typography>
                    <Typography variant='subtitle1' sx={{ fontWeight: 700, mt: 0.25 }}>
                        {capitalize(art.title)}
                    </Typography>
                    <Chip
                        label={capitalize(art.font)}
                        size='small'
                        variant='outlined'
                        sx={{ mt: 1, borderColor: '#bdbdbd', color: '#555', backgroundColor: '#fff' }}
                    />
                </Box>
                {editMode && (
                    <Stack direction="column" spacing={0.5}>
                        <Button size="small" startIcon={<EditIcon />} color="primary"
                            onClick={(e) => { e.stopPropagation(); onEdit && onEdit(art.id); }}>
                            Editar
                        </Button>
                        <Button size="small" startIcon={<DeleteIcon />} color="error"
                            onClick={(e) => { e.stopPropagation(); onDelete && onDelete(art.id); }}>
                            Excluir
                        </Button>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}