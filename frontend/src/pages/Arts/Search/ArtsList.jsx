import { Box, Button, Grid, Typography } from "@mui/material";
import { ArtsListItem } from "./ArtsListItem";
export const ArtsList = ({ arts, total, page, limit, paginationActive, onPageChange, editMode, onEdit, onDelete }) => {
        const totalPages = Math.ceil(total / limit);

    return (
        <Grid item xs={12} lg={8}>
            <Typography
                variant='body2'
                sx={{ color: 'text.secondary', mb: 2 }}
            >
                {total} obra{total !== 1 ? 's' : ''} encontrada{total !== 1 ? 's' : ''}
                {paginationActive && totalPages > 1 && ` (Página ${page} de ${totalPages})`}
            </Typography>

            {arts.length === 0 ? (
                <Typography
                    variant="h6"
                    sx={{ my: 5, mx: 2 }}
                    color="text.secondary"
                    align="center"
                >
                    {'Nenhuma obra encontrada :('}
                </Typography>
            ) : (
                arts.map((art, index) => (
                <ArtsListItem key={index} art={art} editMode={editMode} onEdit={onEdit} onDelete={onDelete} />
            ))
            )}

            {paginationActive && totalPages > 1 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                    <Button
                        variant='outlined'
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        sx={{ borderColor: '#bdbdbd', color: '#555' }}
                    >
                        &lt; Anterior
                    </Button>
                    <Typography variant='body2' sx={{ color: 'text.secondary' }}>
                        Página {page} de {totalPages}
                    </Typography>
                    <Button
                        variant='outlined'
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        sx={{ borderColor: '#bdbdbd', color: '#555' }}
                    >
                        Próximo &gt;
                    </Button>
                </Box>
            )}
        </Grid>
    );
};
