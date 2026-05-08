import FilterListIcon from '@mui/icons-material/FilterList';
import { Button, Grid, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const FilterBy = ({
    fonts,
    searchTitleString,
    setSearchTitleString,
    searchAuthorString,
    setSearchAuthorString,
    onFontChange,
    onCleanFilters,
}) => {
    const [selectedTypeIndex, setSelectedTypeIndex] = useState('');

    const handleTypeChange = (value) => {
        setSelectedTypeIndex(value);
        onFontChange(value === '' ? null : fonts[value].name);
    };

    const handleCleanFilters = () => {
        setSelectedTypeIndex('');
        onCleanFilters();
    };

    return (
        <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                    <FilterListIcon />
                    <Typography variant="h6">Filtros</Typography>
                </Stack>

                <Typography variant="body2" mb={1}>Buscar</Typography>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Título ou código..."
                    value={searchTitleString}
                    onChange={(e) => setSearchTitleString(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" mb={1}>Autor / Compositor</Typography>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Nome do autor ou compositor..."
                    value={searchAuthorString}
                    onChange={(e) => setSearchAuthorString(e.target.value)}
                    sx={{ mb: 2 }}
                />

                <Typography variant="body2" mb={1}>Tipo de Ficha</Typography>
                <Select
                    fullWidth
                    size="small"
                    value={selectedTypeIndex}
                    displayEmpty
                    onChange={(e) => handleTypeChange(e.target.value)}
                    sx={{ mb: 2 }}
                >
                    <MenuItem value="">Todos os tipos</MenuItem>
                    {fonts.map((font, index) => (
                        <MenuItem key={index} value={index}>{font.name}</MenuItem>
                    ))}
                </Select>

                <Button fullWidth variant="outlined" onClick={handleCleanFilters}>
                    Limpar Filtros
                </Button>
            </Paper>
        </Grid>
    );
};
