import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  MenuItem,
  Paper,
  Grid,
  TextField,
  List,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  FormControl,
  InputLabel,
  Select,
  DialogTitle,
  Stack,
} from '@mui/material';
import Pagination from '@mui/material/Pagination';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Country, State, City } from 'country-state-city';

import { useState, useEffect, useContext } from 'react';
import * as React from 'react';

import { ResourceListItem } from '../../components/ResourceListItem/ResourceListItem';
import { AuthContext } from '../../contexts/auth';
import { getUsers, deleteUser, updateUserId, getUserId } from '../../services/api';
import usePagination from '../../services/pagination';
import { hasPermission, CONTEXTS, SCOPES } from '../../services/permissions'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AdminUsers() {
  const { role, id } = useContext(AuthContext);
  const [searchString, setSearchString] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [open, setOpen] = React.useState(false);

  const [users, setUsers] = useState([]);
  const [, setHidden] = useState(false);
  //validation
  const [errors, setErrors] = useState({});
  const [birthDate, setBirthDate] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [currentRole, setRole] = useState('');
  const [form, setForm] = useState({});
  const allCountry = Country.getAllCountries();

  // vindo de fonts
  const [, setLoading] = useState(false);
  const [, setName] = useState('');
  const [, setDescription] = useState('');
  const [, setInputChars] = useState([{ name: '', domain: '' }]);
  const [, setOpenSnack] = React.useState(false);
  const [, setOpenSnackDelete] = React.useState(false);
  const [currentId, setCurrentId] = useState('');

  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentDeleteId, setCurrentDeleteId] = useState("");


  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })

    if (errors[field]) setErrors({
      ...errors,
      [field]: null
    })
  }


  //vindo de fonts
  const handleClickSnack = () => {
    setOpenSnack(true);
  };

  const handleClickSnackDelete = () => {
    setOpenSnackDelete(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setCurrentDeleteId("");
  }

  const fetchUsers = async () => {
    try {
      const { data } = await getUsers();
      const users = data;
      setUsers(users);
      if (users.len === 0) {
        setHidden(false);
      } else {
        setHidden(true);
      }
    } catch (err) {
      setHidden(false);
    }
  };

  useEffect(() => {
    document.title = 'CEDOMCA | Lista de usuários';

    fetchUsers().then(() => setLoadingData(false));
  }, []);

  useEffect(() => {
    const searchedUsers = users.filter((user) =>
      user.fullName.toLowerCase().includes(searchString.toLowerCase()),
    );
    setSearchResult(searchedUsers);
  }, [searchString, users]);

  const fetchUserId = async (id) => {
    setField('fullName', "");
    setBirthDate("");
    setCountry("");
    setCity("");
    setState("");
    setRole("");
    setCurrentId("");
    try {
      setLoading(true);
      const { data } = await getUserId(id);
      const countryObj = Country.getAllCountries().find((c) => c.name === data.country);
      const stateObj = State.getStatesOfCountry(countryObj.isoCode).find(
        (s) => s.name === data.state,
      );
      const cityObj = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode).find(
        (c) => c.name === data.city,
      );
      setField('fullName', data.fullName);
      setBirthDate(data.birthDate);
      setCountry(countryObj);
      setCity(cityObj);
      setState(stateObj);
      setRole(data.role);
      setCurrentId(id);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleUpdateUser = (id, event) => {
    event.preventDefault();
    fetchUserId(id);
    setOpen(true);
  };

  const handleSubmitUpdate = async (e, id) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = findFormErrors()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
    } else {
      const data = {
        fullName: form.fullName,
        birthDate: birthDate,
        country: country.name,
        state: state.name,
        city: city.name,
        role: currentRole,
        id: id,
      };
      try {
        await updateUserId(id, data);
        setForm({});
        setLoading(false);
        handleClose();
        handleClickSnack();
        fetchUsers();
        setCurrentId("");
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    }


  };

  const handleDeleteUser = async (id, event) => {
    event.preventDefault();
    setLoading(true);
    setCurrentDeleteId("");
    setOpenConfirm(false);

    try {
      await deleteUser(id);
      setLoading(false);
      handleClickSnackDelete();
      fetchUsers();
    } catch (err) {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setName('');
    setDescription('');
    setInputChars([{ name: '', domain: '' }]);
  };

  const findFormErrors = () => {
    const { fullName } = form;
    const newErrors = {};
    // fullName errors
    if (!fullName || fullName === '') newErrors.fullName = 'Nome obrigatório';

    return newErrors;
  };


  const buildSkeletonList = () => (
    <>
      <ResourceListItem isLoading={loadingData} />
      <ResourceListItem isLoading={loadingData} />
      <ResourceListItem isLoading={loadingData} />
    </>
  );

  const buildUsersList = () =>
    searchString === ''
      ? _DATA.currentData().map((user) => (
        <ResourceListItem
          key={user.id}
          primary={user.fullName}
          secondary={user.email}
          onClickDelete={(event) => showConfirmDelte(user.id, event)}
          onClickUpdate={(event) => handleUpdateUser(user.id, event)}
          isLoading={loadingData}
          isHidden={!hasPermission(role, CONTEXTS.user, SCOPES.canDelete) || (user.id == id)}
        />
      ))
      : searchResult.map((user) => (
        <ResourceListItem
          key={user.id}
          primary={user.fullName}
          secondary={user.email}
          onClickDelete={(event) => showConfirmDelte(user.id, event)}
          onClickUpdate={(event) => handleUpdateUser(user.id, event)}
          isLoading={loadingData}
          isHidden={!hasPermission(role, CONTEXTS.user, SCOPES.canDelete) || (user.id == id)}
        />
      ));

  const showConfirmDelte = (index, event) => {
    event.preventDefault();
    setOpenConfirm(true);
    setCurrentDeleteId(index);
  };

  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const count = Math.ceil(users.length / PER_PAGE);
  const _DATA = usePagination(users, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  return (
    <div>
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
                placeholder="Pesquisar por nome do usuário"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                  startAdornment: <SearchIcon color="inherit" sx={{ display: 'block' }} />,
                }}
                variant="standard"
                onChange={(event) => setSearchString(event.target.value)}
              />
            </Stack>
          </Toolbar>
        </AppBar>
        {!loadingData && users.length === 0 && (
          <Typography variant="h6" sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
            {'Nenhum usuário foi cadastrado ainda :('}
          </Typography>
        )}
        {!loadingData && users.length !== 0 && searchResult.length === 0 && (
          <Typography variant="h6" sx={{ my: 5, mx: 2 }} color="text.secondary" align="center">
            {'Nenhum usuário encontrado :('}
          </Typography>
        )}
        <List alignItems="center" sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {loadingData ? buildSkeletonList() : buildUsersList()}
        </List>

        <Dialog
          open={open}
          fullWidth
          maxWidth={'lg'}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
          onBackdropClick="false"
        >
          <DialogTitle>
            <Grid container direction="row" justifyContent="space-between" alignItems="center">
              <Button onClick={handleClose}>
                <KeyboardArrowLeft />
                Voltar
              </Button>
              {'Editar usuário'}
              <Grid>
                {' '}
              </Grid>

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
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2} columns={12}>
                  <Grid item xs={12}>
                    <TextField
                      autoComplete="given-name"
                      name="fullName"
                      required
                      fullWidth
                      id="fullName"
                      value={form.fullName}
                      label="Nome completo"
                      onChange={(e) => setField('fullName', e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      {...(errors.fullName && { error: true, helperText: errors.fullName })}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        label="Data de nascimento *"
                        inputFormat="DD/MM/YYYY"
                        value={form.birthDate}
                        renderInput={(params) => <TextField {...params} />}
                        onChange={(e) => setField('birthDate', e)}
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel id="demo-simple-select-outlined-label">País *</InputLabel>
                      <Select
                        sx={{ width: 170 }}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="País * "
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                        }}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {allCountry.map((country) => (
                          <MenuItem key={country.isoCode} value={country}>
                            {country.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel id="demo-simple-select-outlined-label">Estado *</InputLabel>
                      <Select
                        sx={{ width: 170 }}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        value={state}
                        label="Estado * "
                        onChange={(e) => {
                          setState(e.target.value);
                        }}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {State.getStatesOfCountry(country.isoCode).map((state) => (
                          <MenuItem key={state.isoCode} value={state}>
                            {state.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl>
                      <InputLabel id="demo-simple-select-outlined-label">Cidade *</InputLabel>
                      <Select
                        sx={{ width: 170 }}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Cidade * "
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        <MenuItem value="">
                          <em>-</em>
                        </MenuItem>
                        {City.getCitiesOfState(country.isoCode, state.isoCode).map((city) => (
                          <MenuItem key={city.name} value={city}>
                            {city.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6.5}>
                    <FormControl>
                      <InputLabel id="demo-simple-select-label">Papel do usuário *</InputLabel>
                      <Select
                        sx={{ width: 300 }}
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        label="Possíveis Valores"
                        value={currentRole}
                        onChange={(e) => setRole(e.target.value)}
                      >
                        <MenuItem value="visitor">Visitante</MenuItem>
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="super">Super</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={(event) => handleSubmitUpdate(event, currentId)}
                >
                  Confirmar
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        <Dialog
          onBackdropClick="false"
          open={openConfirm}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Deseja excluir este usuário?"}</DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button onClick={handleCloseConfirm} >Cancelar</Button>
            <Button onClick={(event) => handleDeleteUser(currentDeleteId, event)} color="error">Excluir</Button>
          </DialogActions>
        </Dialog>
        {!loadingData && users.length !== 0 && searchString === '' && (
          <Box display="flex" justifyContent="right">
            <Pagination count={count} page={page} showFirstButton showLastButton onChange={handleChange} />
          </Box>
        )}
      </Paper>
    </div>
  );
}
export default AdminUsers;
