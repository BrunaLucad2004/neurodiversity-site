import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import {
    Alert,
    Box,
    Button,
    capitalize,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slide,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import { createArt, deleteArt, getArtId, getArts, getFontId, getFonts, updateArtId } from "../../../services/api";
import { ArtsList } from "./ArtsList";
import { FilterBy } from "./FilterBy";

const LIMIT = 10;

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const SearchArtwork = () => {
    const [fonts, setFonts] = useState([]);
    const [arts, setArts] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [isFetchingData, setIsFetchingData] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchAuthor, setSearchAuthor] = useState('');
    const [selectedFont, setSelectedFont] = useState(null);
    const [paginationActive, setPaginationActive] = useState(true);
    const debounceSearchRef = useRef(null);
    const debounceAuthorRef = useRef(null);

    // CRUD state from Arts.jsx
    const [open, setOpen] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [currentDeleteId, setCurrentDeleteId] = useState("");
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

    useEffect(() => {
        document.title = 'CEDOMCA | Pesquisar obras';
        getFonts().then((res) => setFonts(res.data));
    }, []);

    useEffect(() => {
        if (fonts.length > 0) {
            setIsFetchingData(false);
            fetchArts(null, '', '', 1);
        }
    }, [fonts]);

    const fetchArts = (font, search, author, pg) => {
        getArts({ font, search: search || undefined, author: author || undefined, page: pg, limit: LIMIT })
            .then((res) => {
                setArts(res.data?.data ?? res.data);
                setTotal(res.data.total);
                setPaginationActive(true);
            });
    };

    // CRUD logic from Arts.jsx
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

    const handleCloseConfirm = () => {
        setOpenConfirm(false);
        setCurrentDeleteId("");
    };

    const setField = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
    };

    const verifyErrorCode = (value) => {
        errors.code = null;
        setCode(value);
    };

    const verifyTitleCode = (value) => {
        errors.title = null;
        setTitle(value);
    };

    const fetchFontId = async (id) => {
        try {
            const { data } = await getFontId(id);
            setSelectedFontAttr(data.attributes);

            data.attributes.forEach(attr => setField(attr.name, ""));
        } catch (err) {
            console.error(err);
        }
    };

    const setFontandSelectedFont = (value, id) => {
        errors.font = null;
        setFont(value);
        fetchFontId(id);
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

            const data = {
                code: code,
                title: title,
                font: font,
                attributes: attr
            };

            try {
                await createArt(data);
                handleClose();
                fetchArts(selectedFont, searchQuery, searchAuthor, page);
            } catch (err) {
                setShow(true);
                let errorMsg = err.response?.data?.message?.toString() || "Erro ao criar arte.";
                let newErrorMsg = errorMsg.replaceAll(',', '\n\n');
                setMessage(newErrorMsg);
                setTimeout(() => {
                    setShow(false);
                    setMessage("");
                }, 7000);
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

    const handleUpdateArt = (id) => {
        fetchArtId(id);
        setIsUpdate(true);
        setOpen(true);
    };

    const handleSubmitUpdate = async (e, id) => {
        e.preventDefault();

        const newErrors = findFormErrors();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
        } else {
            const attr = [];
            selectedFontAttr.map(attrMapped => {
                attr.push({
                    name: attrMapped.name,
                    value: attrMapped.value
                });
            });

            const data = {
                code: code,
                title: title,
                font: font,
                attributes: attr
            };

            try {
                await updateArtId(id, data);
                handleClose();
                fetchArts(selectedFont, searchQuery, searchAuthor, page);
            } catch (err) {
                setShow(true);
                let errorMsg = err.response?.data?.message?.toString() || "Erro ao atualizar arte.";
                let newErrorMsg = errorMsg.replaceAll(',', '\n\n');
                setMessage(newErrorMsg);
                setTimeout(() => {
                    setShow(false);
                    setMessage("");
                }, 7000);
            }
        }
    };

    const handleDeleteArt = async (id, event) => {
        event.preventDefault();
        setCurrentDeleteId("");
        setOpenConfirm(false);

        try {
            await deleteArt(id);
            fetchArts(selectedFont, searchQuery, searchAuthor, page);
        } catch (err) {
            console.error("Erro ao excluir arte", err);
        }
    };

    const showConfirmDelete = (id) => {
        setOpenConfirm(true);
        setCurrentDeleteId(id);
    };

    const updateSelectedFontAttr = (name, value) => {
        if (errors[name]) setErrors({ ...errors, [name]: null });

        return selectedFontAttr.map(attr => {
            if (attr.name === name) {
                return { ...attr, value: value };
            }
            return attr;
        });
    };

    const handleFontChange = (font) => {
        setSelectedFont(font);
        setPage(1);
        fetchArts(font, searchQuery, searchAuthor, 1);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        if (debounceSearchRef.current) clearTimeout(debounceSearchRef.current);
        debounceSearchRef.current = setTimeout(() => {
            setPage(1);
            fetchArts(selectedFont, value, searchAuthor, 1);
        }, 400);
    };

    const handleAuthorChange = (value) => {
        setSearchAuthor(value);
        if (debounceAuthorRef.current) clearTimeout(debounceAuthorRef.current);
        debounceAuthorRef.current = setTimeout(() => {
            setPage(1);
            fetchArts(selectedFont, searchQuery, value, 1);
        }, 400);
    };

    const handleCleanFilters = () => {
        if (debounceSearchRef.current) clearTimeout(debounceSearchRef.current);
        if (debounceAuthorRef.current) clearTimeout(debounceAuthorRef.current);
        setSearchQuery('');
        setSearchAuthor('');
        setSelectedFont(null);
        setPage(1);
        fetchArts(null, '', '', 1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        fetchArts(selectedFont, searchQuery, searchAuthor, newPage);
    };

    return (
        <Box sx={{ backgroundColor: '#f0f0f0', minHeight: '100vh', padding: '1.5rem' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant='h5' sx={{ fontWeight: 'bold' }}>
                    Lista de Obras
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {editMode && (
                        <Button
                            startIcon={<AddIcon />}
                            variant="contained"
                            onClick={() => setOpen(true)}
                            sx={{
                                backgroundColor: '#7BAAA7',
                                '&:hover': {
                                    backgroundColor: '#6A9391',
                                },
                                color: '#000000',
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Adicionar nova obra
                        </Button>
                    )}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editMode}
                                onChange={() => setEditMode(!editMode)}
                                color='primary'
                            />
                        }
                        label='Modo de Edição'
                        labelPlacement='start'
                    />
                </Box>
            </Box>
            {!isFetchingData && (
                <Grid container spacing={3}>
                    <FilterBy
                        fonts={fonts}
                        searchTitleString={searchQuery}
                        setSearchTitleString={handleSearchChange}
                        searchAuthorString={searchAuthor}
                        setSearchAuthorString={handleAuthorChange}
                        onFontChange={handleFontChange}
                        onCleanFilters={handleCleanFilters}
                    />
                    <ArtsList
                        arts={arts}
                        total={total}
                        page={page}
                        limit={LIMIT}
                        paginationActive={paginationActive}
                        onPageChange={handlePageChange}
                        editMode={editMode}
                        onEdit={handleUpdateArt}
                        onDelete={showConfirmDelete}
                    />
                </Grid>
            )}

            <Dialog
                open={open}
                fullWidth
                maxWidth={'lg'}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
            >
                <DialogTitle>
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                        <Button onClick={handleClose}>
                            <KeyboardArrowLeft />
                            Voltar
                        </Button>
                        {isUpdate ? "Editar obra" : "Cadastrar obra"}
                        {isUpdate ? (
                            <Button variant="contained" onClick={event => handleSubmitUpdate(event, currentId)}>
                                Editar
                            </Button>
                        ) : (
                            <Button variant="contained" onClick={handleSubmit}>
                                Cadastrar
                            </Button>
                        )}
                    </Grid>
                </DialogTitle>
                <DialogContent>
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            m: 'auto',
                            width: 'auto',
                        }}
                    >
                        <Collapse in={show} sx={{ mb: 2, mt: 2 }}>
                            <Alert severity="error">
                                <p>{message}</p>
                            </Alert>
                        </Collapse>

                        <Grid
                            container
                            direction="row"
                            justifyContent="space-around"
                            alignItems="flex-start"
                            columns={12}
                            sx={{ mt: 2 }}
                        >
                            <Grid item xs={6} sx={{ px: 2 }}>
                                <TextField
                                    name="code"
                                    required
                                    fullWidth
                                    id="code"
                                    label="Código"
                                    sx={{ mt: 2 }}
                                    value={code}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => verifyErrorCode(e.target.value)}
                                    {...(errors.code && {
                                        error: true,
                                        helperText: errors.code,
                                    })}
                                />

                                <TextField
                                    required
                                    fullWidth
                                    id="title"
                                    label="Título"
                                    name="title"
                                    sx={{ mt: 2 }}
                                    value={title}
                                    InputLabelProps={{ shrink: true }}
                                    onChange={(e) => verifyTitleCode(e.target.value)}
                                    {...(errors.title && {
                                        error: true,
                                        helperText: errors.title,
                                    })}
                                />

                                <FormControl sx={{ mt: 2, width: '100%' }}
                                    {...(errors.font && {
                                        error: true,
                                    })}>
                                    <InputLabel id="demo-simple-select-label">Ficha catalográfica</InputLabel>
                                    <Select
                                        disabled={isUpdate}
                                        fullWidth
                                        labelId="demo-simple-select-outlined-label"
                                        id="demo-simple-select-outlined"
                                        label="Possíveis Valores"
                                        name="font"
                                        value={font ? capitalize(font) : ""}
                                        onChange={(e, child) => {
                                            const childKey = child.props['a-key'];
                                            setFontandSelectedFont(e.target.value, childKey);
                                        }}
                                    >
                                        {fonts.map(f => (
                                            <MenuItem a-key={f.id} key={f.id} value={f.name}>{f.name}</MenuItem>
                                        ))}
                                    </Select>
                                    {errors.font && <Typography variant="caption" color="error">{errors.font}</Typography>}
                                </FormControl>
                            </Grid>

                            <Grid item xs={6} sx={{ px: 2 }}>
                                <Grid container direction="row" justifyContent="space-between" alignItems="center">
                                    {isUpdate ?
                                        selectedFontAttr.map(attr => (
                                            <TextField
                                                key={attr.name}
                                                name={attr.name}
                                                required
                                                id={attr.name}
                                                label={attr.name}
                                                value={attr.value}
                                                sx={{ mt: 2, width: '48%' }}
                                                onChange={(e) => {
                                                    const updatedAttr = updateSelectedFontAttr(attr.name, e.target.value);
                                                    setSelectedFontAttr(updatedAttr);
                                                }}
                                                {...(errors[attr.name] && {
                                                    error: true,
                                                    helperText: errors[attr.name],
                                                })}
                                            />
                                        ))
                                        : selectedFontAttr.map(attr => (
                                            <TextField
                                                key={attr.name}
                                                name={attr.name}
                                                required
                                                id={attr.name}
                                                label={attr.name}
                                                sx={{ mt: 2, width: '48%' }}
                                                onChange={(e) => setField(attr.name, e.target.value)}
                                                {...(errors[attr.name] && {
                                                    error: true,
                                                    helperText: errors[attr.name],
                                                })}
                                            />
                                        ))
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions />
            </Dialog>

            <Dialog
                open={openConfirm}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleCloseConfirm}
            >
                <DialogTitle>{"Deseja excluir esta obra?"}</DialogTitle>
                <DialogContent />
                <DialogActions>
                    <Button onClick={handleCloseConfirm} color="primary">Cancelar</Button>
                    <Button onClick={(e) => handleDeleteArt(currentDeleteId, e)} color="error" variant="contained">Excluir</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};