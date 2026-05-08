import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import {
    Paper, AppBar, Toolbar, Stack, TextField, Button, Typography, List,
    Dialog, DialogTitle, DialogContent, DialogActions, Slide,
    Grid, Box, FormControl, InputLabel, Select, MenuItem, Collapse, capitalize
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { useState, useEffect, useRef } from 'react';
import * as React from 'react';
import { ResourceListItem } from '../../components/ResourceListItem/ResourceListItem';
import { getArts, deleteArt, getFonts, createArt, getArtId, updateArtId, getFontId } from '../../services/api';

const LIMIT = 10;

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function Arts() {
    const [searchString, setSearchString] = useState('');
    const [arts, setArts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loadingData, setLoadingData] = useState(true);
    const debounceRef = useRef(null);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [currentDeleteId, setCurrentDeleteId] = useState("");
    const [open, setOpen] = useState(false);
    const [fonts, setFonts] = useState([]);
    const [errors, setErrors] = useState({});
    const [currentId, setCurrentId] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [font, setFont] = useState("");
    const [selectedFontAttr, setSelectedFontAttr] = useState([]);
    const [form, setForm] = useState({});
    const [show, setShow] = useState(false);
    const [message, setMessage] = useState("");

    const verifyErrorCode = (value) => {
        errors.code = null;
        setCode(value);
    };

    const verifyTitleCode = (value) => {
        errors.title = null;
        setTitle(value);
    };

    const setField = (field, value) => {
        setForm({ ...form, [field]: value });
        if (errors[field]) setErrors({ ...errors, [field]: null });
    };

    const handleDeleteArt = async (id, event) => {
        event.preventDefault();
        setCurrentDeleteId("");
        setOpenConfirm(false);
        try {
            await deleteArt(id);
            fetchArts(searchString, page);
        } catch (err) {
            console.error("Erro ao excluir arte", err);
        }
    };

    const fetchArts = async (search = '', pg = 1) => {
        try {
            const { data } = await getArts({ title: search || undefined, page: pg, limit: LIMIT });
            setArts(data.data ?? data);
            setTotal(data.total ?? 0);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFonts = async () => {
        try {
            const { data } = await getFonts();
            setFonts(data);
        } catch (err) {
            console.log(err);
        }
    };

    const findFormErrors = () => {
        const newErrors = {};
        if (!code || code === '') newErrors.code = 'Código obrigatório';
        if (!title || title === '') newErrors.title = 'Título obrigatório';
        if (!font || font === '') newErrors.font = 'Ficha catalográfica obrigatória';
        if (isUpdate) {
            selectedFontAttr.map(attrMapped => {
                if (!attrMapped.value || attrMapped.value === '') {
                    newErrors[attrMapped.name] = `${attrMapped.name.charAt(0).toUpperCase() + attrMapped.name.slice(1)} obrigatório`;
                }
            });
        } else {
            selectedFontAttr.map(attrMapped => {
                if (!form[attrMapped.name] || form[attrMapped.name] === '') {
                    newErrors[attrMapped.name] = `${attrMapped.name.charAt(0).toUpperCase() + attrMapped.name.slice(1)} obrigatório`;
                }
            });
        }
        return newErrors;
    };

    useEffect(() => {
        document.title = 'CEDOMCA | Lista de obras';
        fetchArts().then(() => setLoadingData(false));
    }, []);

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setCurrentDeleteId("");
    };

    const showConfirmDelete = (index, event) => {
        event.preventDefault();
        setOpenConfirm(true);
        setCurrentDeleteId(index);
    };

    const handleClickOpen = () => {
        setOpen(true);
        fetchFonts();
    };

    const handleClose = () => {
        setCode("");
        setTitle("");
        setFont("");
        setErrors({});
        setForm({});
        setSelectedFontAttr([]);
        setOpen(false);
        setIsUpdate(false);
    };

    const setFontandSelectedFont = (value, id) => {
        errors.font = null;
        setFont(value);
        fetchFontId(id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const attr = [];
            Object.entries(form).map(([key, value]) => {
                attr.push({ name: key, value: value });
            });
            const data = { code, title, font, attributes: attr };
            try {
                await createArt(data);
                handleClose();
                fetchArts(searchString, page);
            } catch (err) {
                setShow(true);
                let errorMsg = err.response?.data?.message?.toString() || "Erro ao criar arte.";
                setMessage(errorMsg.replaceAll(',', '\n\n'));
                setTimeout(() => { setShow(false); setMessage(""); }, 7000);
            }
        }
    };

    const fetchArtId = async (id) => {
        try {
            const { data } = await getArtId(id);
            setCode(data.code);
            setTitle(data.title);
            setFont(data.font);
            setSelectedFontAttr(data.attributes);
            setCurrentId(id);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchFontId = async (id) => {
        try {
            const { data } = await getFontId(id);
            setSelectedFontAttr(data.attributes);
            data.attributes.map(attr => setField(attr.name, ""));
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateArt = (id, event) => {
        event.preventDefault();
        fetchArtId(id);
        setIsUpdate(true);
        fetchFonts();
        setOpen(true);
    };

    const handleSubmitUpdate = async (e, id) => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const attr = selectedFontAttr.map(attrMapped => ({ name: attrMapped.name, value: attrMapped.value }));
            const data = { code, title, font, attributes: attr };
            try {
                await updateArtId(id, data);
                handleClose();
                fetchArts(searchString, page);
            } catch (err) {
                setShow(true);
                let errorMsg = err.response?.data?.message?.toString() || "Erro ao atualizar arte.";
                setMessage(errorMsg.replaceAll(',', '\n\n'));
                setTimeout(() => { setShow(false); setMessage(""); }, 7000);
            }
        }
    };

    const buildSkeletonList = () => (
        <>
            <ResourceListItem isLoading={loadingData} />
            <ResourceListItem isLoading={loadingData} />
            <ResourceListItem isLoading={loadingData} />
        </>
    );

    const buildArtsList = () =>
        arts.map((art) => (
            <ResourceListItem
                key={art.id}
                primary={art.title}
                secondary={art.font}
                onClickDelete={(event) => showConfirmDelete(art.id, event)}
                onClickUpdate={(event) => handleUpdateArt(art.id, event)}
                isLoading={loadingData}
            />
        ));

    const updateSelectedFontAttr = (name, value) => {
        if (errors[name]) setErrors({ ...errors, [name]: null });
        return selectedFontAttr.map(attr => attr.name === name ? { ...attr, value } : attr);
    };

    return (
        <Paper sx={{ maxWidth: 980, margin: 'auto', marginTop: 5, overflow: 'hidden' }}>
            <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Toolbar>
                    <Stack direction="row" sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            placeholder="Pesquisar por obras"
                            value={searchString}
                            InputProps={{
                                disableUnderline: true,
                                sx: { fontSize: 'default' },
                                startAdornment: <SearchIcon color="inherit" sx={{ display: 'block', mr: 1 }} />,
                            }}
                            variant="standard"
                            onChange={(event) => {
                                const value = event.target.value;
                                setSearchString(value);
                                if (debounceRef.current) clearTimeout(debounceRef.current);
                                debounceRef.current = setTimeout(() => {
                                    setPage(1);
                                    fetchArts(value, 1);
                                }, 400);
                            }}
                        />
                        <Button
                            startIcon={<AddIcon />}
                            size="small"
                            variant="contained"
                            onClick={handleClickOpen}
                            sx={{
                                whiteSpace: 'nowrap',
                                minWidth: 'max-content',
                                backgroundColor: '#7BAAA7',
                                '&:hover': { backgroundColor: '#6A9391' },
                                color: '#000000'
                            }}
                        >
                            Adicionar nova obra
                        </Button>
                    </Stack>
                </Toolbar>
            </AppBar>

            {!loadingData && arts.length === 0 && (
                <Typography variant="h6" sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
                    {searchString ? 'Nenhuma Obra encontrada :(' : 'Nenhuma Obra foi cadastrada ainda :('}
                </Typography>
            )}

            <List alignItems="center" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {loadingData ? buildSkeletonList() : buildArtsList()}
            </List>

            {!loadingData && total > 0 && (
                <Stack direction='row' alignItems='center' justifyContent='center' spacing={2} sx={{ py: 2, borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                    <Button variant='outlined' size='small' disabled={page <= 1} onClick={() => { const prev = page - 1; setPage(prev); fetchArts(searchString, prev); }}>
                        &lt; Anterior
                    </Button>
                    <Typography variant='body2' color='text.secondary'>
                        Página {page} de {Math.ceil(total / LIMIT)}
                    </Typography>
                    <Button variant='outlined' size='small' disabled={page >= Math.ceil(total / LIMIT)} onClick={() => { const next = page + 1; setPage(next); fetchArts(searchString, next); }}>
                        Próximo &gt;
                    </Button>
                </Stack>
            )}

            <Dialog open={open} fullWidth maxWidth={'lg'} TransitionComponent={Transition} keepMounted onClose={handleClose}>
                <DialogTitle>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                        <Button onClick={handleClose}><KeyboardArrowLeft />Voltar</Button>
                        {isUpdate ? "Editar obra" : "Cadastrar obra"}
                        {isUpdate ? (
                            <Button variant="contained" onClick={event => handleSubmitUpdate(event, currentId)}>Editar</Button>
                        ) : (
                            <Button variant="contained" onClick={handleSubmit}>Cadastrar</Button>
                        )}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Box noValidate component="form" sx={{ display: 'flex', flexDirection: 'column', m: 'auto', width: 'auto' }}>
                        <Collapse in={show} sx={{ mb: 2, mt: 2 }}>
                            <Alert severity="error"><p>{message}</p></Alert>
                        </Collapse>
                        <Grid container direction="row" justifyContent="space-around" alignItems="flex-start" columns={12} sx={{ mt: 2 }}>
                            <Grid item xs={6} sx={{ px: 2 }}>
                                <TextField name="code" required fullWidth id="code" label="Código" sx={{ mt: 2 }} value={code} InputLabelProps={{ shrink: true }} onChange={(e) => verifyErrorCode(e.target.value)} {...(errors.code && { error: true, helperText: errors.code })} />
                                <TextField required fullWidth id="title" label="Título" name="title" sx={{ mt: 2 }} value={title} InputLabelProps={{ shrink: true }} onChange={(e) => verifyTitleCode(e.target.value)} {...(errors.title && { error: true, helperText: errors.title })} />
                                <FormControl sx={{ mt: 2, width: '100%' }} {...(errors.font && { error: true })}>
                                    <InputLabel id="demo-simple-select-label">Ficha catalográfica</InputLabel>
                                    <Select disabled={isUpdate} fullWidth labelId="demo-simple-select-outlined-label" id="demo-simple-select-outlined" label="Possíveis Valores" name="font" value={font ? capitalize(font) : ""} onChange={(e, child) => { const childKey = child.props['a-key']; setFontandSelectedFont(e.target.value, childKey); }}>
                                        {fonts.map(font => (<MenuItem a-key={font.id} key={font.id} value={font.name}>{font.name}</MenuItem>))}
                                    </Select>
                                    {errors.font && <Typography variant="caption" color="error">{errors.font}</Typography>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6} sx={{ px: 2 }}>
                                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                    {isUpdate ?
                                        selectedFontAttr.map(attr => (
                                            <TextField key={attr.name} name={attr.name} required id={attr.name} label={attr.name} value={attr.value} sx={{ mt: 2, width: '48%' }} onChange={(e) => { const updatedAttr = updateSelectedFontAttr(attr.name, e.target.value); setSelectedFontAttr(updatedAttr); }} {...(errors[attr.name] && { error: true, helperText: errors[attr.name] })} />
                                        )) :
                                        selectedFontAttr.map(attr => (
                                            <TextField key={attr.name} name={attr.name} required id={attr.name} label={attr.name} sx={{ mt: 2, width: '48%' }} onChange={(e) => setField(attr.name, e.target.value)} {...(errors[attr.name] && { error: true, helperText: errors[attr.name] })} />
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions />
            </Dialog>

            <Dialog open={openConfirm} TransitionComponent={Transition} keepMounted onClose={handleCloseConfirm}>
                <DialogTitle>{"Deseja excluir esta obra?"}</DialogTitle>
                <DialogContent />
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">Cancelar</Button>
                    <Button onClick={(e) => handleDeleteArt(currentDeleteId, e)} color="error" variant="contained">Excluir</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
}
