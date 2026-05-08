import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  List,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  FormControl,
  Box,
  Select,
  MenuItem,
  InputLabel,
  Fab,
  Backdrop,
  CircularProgress,
  Snackbar,
  Stack,
  IconButton,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Pagination from '@mui/material/Pagination';
import { useState, useEffect } from 'react';
import * as React from 'react';
import { ResourceListItem } from '../../components/ResourceListItem/ResourceListItem';
import { getFonts, deleteFont, getFontId, updateFontId, createFont } from '../../services/api';
import usePagination from '../../services/pagination';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Fonts() {
  const [searchString, setSearchString] = useState('');
  const [searchResult, setSearchResult] = useState([]);

  const [loadingData, setLoadingData] = useState(true);

  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState("");
  const [fonts, setFonts] = useState([]);
  const [, setHidden] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [inputChars, setInputChars] = useState([{ name: '', domain: '', errorName: '', errorDomain: '' }]);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [openSnackDelete, setOpenSnackDelete] = React.useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [currentId, setCurrentId] = useState('');
  const [emptyName, setEmptyName] = useState(false);
  const [errorNameText, setErrorNameText] = useState("");
  const [emptyDesc, setEmptyDesc] = useState(false);
  const [errorDescText, setErrorDescText] = useState("");

  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleCloseSnack = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnack(false);
  };

  const handleClickSnackDelete = () => {
    setOpenSnackDelete(true);
  };

  const handleCloseSnackDelete = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackDelete(false);
  };

  const fetchFonts = async () => {
    try {
      const { data } = await getFonts();
      const fonts = data;
      setFonts(fonts);
      if (fonts.len === 0) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    } catch (err) {
      setHidden(false);
    }
  };

  useEffect(() => {
    document.title = 'CEDOMCA | Lista de Fichas Catalográficas';

    fetchFonts().then(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    const filteredFonts = fonts.filter((font) =>
      font.name.toLowerCase().includes(searchString.toLowerCase()),
    );

    setSearchResult(filteredFonts);
  }, [searchString, fonts]);

  const handleClick = () => {
    let newfield = { name: '', domain: '', errorName: '', errorDomain: '' };
    setInputChars([...inputChars, newfield]);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setName("");
    setDescription("");
    setInputChars([{ name: '', domain: '', errorName: '', errorDomain: '' }])
    setIsUpdate(false);
    setErrorDescText("");
    setErrorNameText("");
    setEmptyDesc(false);
    setEmptyName(false);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setCurrentDeleteId("");
  }

  const handleCharChanges = (index, event) => {
    let data = [...inputChars];
    data[index][event.target.name] = event.target.value;

    if (event.target.name === 'name') {
      data[index].errorName = '';
    } else {
      data[index].errorDomain = '';
    }
    setInputChars(data);
  };

  const handleCharChangesError = (index, errorField, errorMessage) => {
    let data = [...inputChars];
    if (errorField === 'name') {
      data[index].errorName = errorMessage;
    } else {
      data[index].errorDomain = errorMessage;
    }
    setInputChars(data);
  }

  const handleDeleteFont = async (id, event) => {
    event.preventDefault();
    setCurrentDeleteId("");
    setOpenConfirm(false);
    setLoading(true);

    try {
      await deleteFont(id);
      setLoading(false);
      handleClickSnackDelete();
      fetchFonts();

    } catch (err) {
      setLoading(false);
    }
  };
  const fetchFontId = async (id) => {
    try {
      setLoading(true);
      const { data } = await getFontId(id);
      setName(data.name);
      setDescription(data.description);
      var newInputChar = [];
      data.attributes.forEach((attr) => {
        let newfield = { name: attr.name, domain: attr.domain, errorName: '', errorDomain: '' };
        newInputChar.push(newfield);
      });
      setInputChars(newInputChar);
      setCurrentId(id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleUpdateFont = (id, event) => {
    event.preventDefault();

    fetchFontId(id);
    setIsUpdate(true);
    setOpen(true);
  };

  const handleSubmitUpdate = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: name,
      description: description,
      attributes: inputChars,
    };

    if (isEmptyFields(data)) {
      setLoading(false);
    } else {
      try {
        await updateFontId(id, data);
        setLoading(false);
        handleClose();
        handleClickSnack();
        fetchFonts();
        setName("");
        setDescription("");
        setIsUpdate(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const isEmptyFields = (data) => {
    let emptyFields = {};
    if (data.name === '' || !data.name) {
      setEmptyName(true);
      setErrorNameText("Nome obrigatório");
      emptyFields.name = true;
    }
    if (data.description === '' || !data.description) {
      setEmptyDesc(true);
      setErrorDescText("Descrição obrigatório");
      emptyFields.description = true;
    }

    data.attributes.map((input, index) => {
      if (input.name === '' || !input.name) {
        handleCharChangesError(index, "name", "Nome obrigatório");
        emptyFields.name = true;
      }

      if (input.domain === '' || !input.domain) {
        handleCharChangesError(index, "domain", "Tipo obrigatório")
        emptyFields.domain = true;
      }
    })

    if (Object.keys(emptyFields).length > 0) {
      return true;
    } else {
      return false;
    }
  }

  const setNameField = (value) => {
    setErrorNameText("");
    setEmptyName(false);
    setName(value);
  }

  const setDescField = (value) => {
    setErrorDescText("");
    setEmptyDesc(false);
    setDescription(value);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = {
      name: name,
      description: description,
      attributes: inputChars,
    };

    if (isEmptyFields(data)) {
      setLoading(false);
    } else {
      try {
        await createFont(data);
        setLoading(false);
        handleClose();
        handleClickSnack();
        fetchFonts();
        setName('');
        setDescription('');
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }
  };

  const showConfirmDelete = (index, event) => {
    event.preventDefault();
    setOpenConfirm(true);
    setCurrentDeleteId(index);
  };

  const buildSkeletonList = () => (
    <>
      <ResourceListItem isLoading={loadingData} />
      <ResourceListItem isLoading={loadingData} />
      <ResourceListItem isLoading={loadingData} />
    </>
  );

  const buildFontsList = () =>
    searchString === ''
      ? _DATA.currentData().map((font) => (
        <ResourceListItem
          key={font.id}
          primary={font.name}
          secondary={font.description}
          onClickDelete={(event) => showConfirmDelete(font.id, event)}
          onClickUpdate={(event) => handleUpdateFont(font.id, event)}
          isLoading={loadingData}
        />
      ))
      : searchResult.map((font) => (
        <ResourceListItem
          key={font.id}
          primary={font.name}
          secondary={font.description}
          onClickDelete={(event) => showConfirmDelete(font.id, event)}
          onClickUpdate={(event) => handleUpdateFont(font.id, event)}
          isLoading={loadingData}
        />
      ));

  const removeCharField = (index) => {
    setInputChars(inputs => inputs.filter((el, i) => i !== index))
  };

  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const count = Math.ceil(fonts.length / PER_PAGE);
  const _DATA = usePagination(fonts, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <Paper sx={{ maxWidth: 980, margin: 'auto', marginTop: 5, overflow: 'hidden' }}>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Stack
            direction="row"
            sx={{
              flexGrow: 1,
            }}
          >
            <TextField
              fullWidth
              placeholder="Pesquisar por nome da ficha catalográfica"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: 'default' },
                startAdornment: <SearchIcon color="inherit" sx={{ display: 'block' }} />,
              }}
              variant="standard"
              onChange={(event) => setSearchString(event.target.value)}
            />
            <Button
              startIcon={<AddIcon />}
              disabled={false}
              size="small"
              variant="contained"
              onClick={handleClickOpen}
              sx={{
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
                backgroundColor: '#7BAAA7',
                '&:hover': {
                  backgroundColor: '#6A9391',
                },
                color: '#000000'
              }}            >
              Adicionar nova ficha catalográfica
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      {!loadingData && fonts.length === 0 && (
        <Typography variant="h6" sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          {'Nenhuma ficha catalográfica foi cadastrada ainda :('}
        </Typography>
      )}
      {!loadingData && fonts.length !== 0 && searchResult.length === 0 && (
        <Typography variant="h6" sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
          {'Nenhuma ficha catalográfica encontrada :('}
        </Typography>
      )}
      <List alignItems="center" sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {loadingData ? buildSkeletonList() : buildFontsList()}
      </List>
      <Dialog
        onBackdropClick="false"
        open={open}
        fullWidth
        maxWidth={'lg'}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <Grid container direction="row" justifyContent="space-between" alignItems="center">
            <Button onClick={handleClose}>
              <KeyboardArrowLeft />
              Voltar
            </Button>
            {isUpdate ? "Editar ficha catalográfica" : "Cadastrar ficha catalográfica"}
            {isUpdate ? (<Button variant="contained" onClick={event => handleSubmitUpdate(event, currentId)}>
              Editar
            </Button>) : (<Button variant="contained" onClick={handleSubmit}>
              Cadastrar
            </Button>)}

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
            <Grid
              container
              alignItems="center"
              justifyContent="center"
              spacing={2}
              columns={12}
              sx={{ mt: 2 }}
            >
              <Grid item xs={6.5}>
                <TextField
                  autoComplete="given-name"
                  name="name"
                  required
                  fullWidth
                  id="name"
                  label="Nome"
                  value={name}
                  error={emptyName}
                  helperText={errorNameText}
                  onChange={(e) => setNameField(e.target.value)}
                />
              </Grid>
              <Grid item xs={6.5}>
                <TextField
                  required
                  fullWidth
                  value={description}
                  id="description"
                  label="Descrição"
                  name="description"
                  error={emptyDesc}
                  helperText={errorDescText}
                  onChange={(e) => setDescField(e.target.value)}
                />
              </Grid>

              <Grid item xs={11} sx={{ mt: 2 }}>
                {inputChars.map((input, index) => (
                  <Grid
                    key={index}
                    container
                    spacing={2}
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 2 }}
                  >
                    <TextField
                      required
                      id="charName"
                      label="Nome da característica"
                      name="name"
                      value={input.name}
                      {...(input.errorName != '' && { error: true, helperText: input.errorName })}
                      sx={{ width: '40%', mr: 2 }}
                      onChange={(event) => handleCharChanges(index, event)}
                    />

                    <FormControl>
                      <InputLabel id="demo-simple-select-label">Possíveis Valores</InputLabel>
                      <Select
                        sx={{ width: 300 }}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Possíveis Valores"
                        name="domain"
                        value={input.domain}
                        {...(input.errorDomain != '' && { error: true, helperText: input.errorDomain })}
                        onChange={(event) => handleCharChanges(index, event)}
                      >
                        <MenuItem value="numeric">Apenas números</MenuItem>
                        <MenuItem value="textual">Apenas letras</MenuItem>
                        <MenuItem value="alphanumeric">Letras e números</MenuItem>
                      </Select>
                    </FormControl>
                    {
                      inputChars.length > 1 ?
                        <IconButton sx={{ ml: 1 }} onClick={() => removeCharField(index)}>
                          <RemoveCircleIcon color="error" />
                        </IconButton> :
                        <></>
                    }

                  </Grid>
                )
                )}
                <Grid container
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center">
                  <Fab color="primary" aria-label="add" sx={{ ml: inputChars.length > 1 ? 15 : 18, mt: 2 }} onClick={handleClick}>
                    <AddIcon />
                  </Fab>{' '}
                  <Typography sx={{ ml: 2, mt: 2 }}>Adicionar nova característica</Typography>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions />
      </Dialog>
      <Dialog
        onBackdropClick="false"
        open={openConfirm}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseConfirm}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Deseja excluir esta ficha catalográfica?"}</DialogTitle>
        <DialogContent />
        <DialogActions>
          <Button onClick={handleCloseConfirm} >Cancelar</Button>
          <Button onClick={(event) => handleDeleteFont(currentDeleteId, event)} color="error">Excluir</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openSnack} autoHideDuration={6000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity="success" sx={{ width: '100%' }}>
          Ficha catalográfica registrada com sucesso!
        </Alert>
      </Snackbar>

      <Snackbar open={openSnackDelete} autoHideDuration={6000} onClose={handleCloseSnackDelete}>
        <Alert onClose={handleCloseSnackDelete} severity="success" sx={{ width: '100%' }}>
          Ficha catalográfica apagada com sucesso!
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {!loadingData && fonts.length !== 0 && searchString === '' && (
        <Box display="flex" justifyContent="right">
          <Pagination count={count} page={page} showFirstButton showLastButton onChange={handleChange} />
        </Box>
      )}
    </Paper>
  );
}
