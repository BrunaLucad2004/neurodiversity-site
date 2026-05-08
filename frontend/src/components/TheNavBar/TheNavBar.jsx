import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import { Stack, Button, Box } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import Dashboard from '../../pages/Dashboard/Dashboard';
import { hasPermission, CONTEXTS, SCOPES } from '../../services/permissions';
import { TheNavBarTabs } from './TheNavBarTabs';
import "../AboutUs/Home/Home.css";

export const TheNavBar = ({ pathname, setFontSize }) => {
  const { authenticated, role, logout } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openDashboardModal, setOpenDashboardModal] = useState(false);

  const handleCloseDashboardModal = () => {
    setOpenDashboardModal(false);
  }

  const handleOpenDashboardModal = () => {
    setOpenDashboardModal(true);
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
  };

  const navBtnStyle = {
    color: '#1a1a1a', 
    textTransform: 'none', 
    fontWeight: 600, 
    fontSize: '0.92em',
    padding: '6px 18px',
    borderRadius: '6px',
    transition: 'background 0.15s',
    '&:hover': {
      background: '#5a9e98',
      color: '#fff',
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <header className="home-header">
        <Link to="/" className="home-header-logo-link">
          <div className="home-header-left">
            <img 
              src={`${process.env.PUBLIC_URL}/cedomca.jpg`} 
              alt="Logo CEDOMCA" 
              className="home-logo-img"
            />
            <div className="home-logo-text">
              <span className="home-logo-title">CEDOMCA</span>
              <span className="home-logo-subtitle">
                Centro de Documentação e Memória da Cultura na Amazônia
              </span>
            </div>
          </div>
        </Link>
      </header>

      {authenticated ? (
        <nav className="home-nav">
          <TheNavBarTabs pathname={pathname} />
          <Stack direction="row" spacing={1} sx={{ ml: 'auto' }}>
            <div style={{ background: '#fff', borderRadius: '6px', padding: '2px 4px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              <Button size="small" sx={{ ...navBtnStyle, minWidth: 32, padding: '4px 8px' }} onClick={() => setFontSize(s => Math.max(12, s - 2))}>A-</Button>
              <Button size="small" sx={{ ...navBtnStyle, minWidth: 32, padding: '4px 8px' }} onClick={() => setFontSize(16)}>A</Button>
              <Button size="small" sx={{ ...navBtnStyle, minWidth: 32, padding: '4px 8px' }} onClick={() => setFontSize(s => Math.min(24, s + 2))}>A+</Button>
            </div>
            {authenticated && hasPermission(role, CONTEXTS.report, SCOPES.canView) ? (
              <Button
                onClick={handleOpenDashboardModal}
                startIcon={<AssessmentIcon />}
                sx={navBtnStyle}
              >
                Relatório
              </Button>
            ) : null}
            <Button
              onClick={handleClickOpen}
              startIcon={<LogoutIcon />}
              sx={navBtnStyle}
            >
              Sair
            </Button>
          </Stack>
        </nav>
      ) : null}

      {authenticated && hasPermission(role, CONTEXTS.report, SCOPES.canView) ? (
        <Dashboard open={openDashboardModal} onClose={handleCloseDashboardModal} />
      ) : null}

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Sair"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Você tem certeza que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleLogout}>OK</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
