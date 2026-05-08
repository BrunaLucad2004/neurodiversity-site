import { Tab, Tabs } from '@mui/material';
import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/auth';
import { hasPermission, CONTEXTS, SCOPES } from '../../services/permissions'

export const TheNavBarTabs = ({ pathname }) => {
  const tabPathToIndex = {
    '/arts/search': 0,
    '/fonts': 1,
    '/users': 2,
  };

  const { role } = useContext(AuthContext);
  const [selectedTab, setSelectedTab] = useState(tabPathToIndex[pathname] ?? 0);
  
  useEffect(() => {
    setSelectedTab(tabPathToIndex[pathname] ?? 0);
  }, [pathname]);

  const handleTabChange = (_event, newSelectedTab) => setSelectedTab(newSelectedTab);
  const multipleScopes = [SCOPES.canView, SCOPES.canCreate, SCOPES.canEdit, SCOPES.canDelete];

  const tabStyle = {
    textTransform: 'none',
    minWidth: 'auto',
    padding: '6px 18px',
    borderRadius: '6px',
    color: '#1a1a1a',
    fontSize: '0.92em',
    minHeight: 'auto',
    opacity: 1,
    transition: 'background 0.15s',
    '&.Mui-selected': {
      background: '#fff',
      color: '#2c2c2c',
      fontWeight: 600,
      border: '1px solid #d0d0d0',
    },
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.3)',
      color: '#000',
    }
  };

  return (
    <Tabs
      value={selectedTab}
      onChange={handleTabChange}
      aria-label="Itens de menu"
      sx={{
        minHeight: 'auto',
        '& .MuiTabs-indicator': {
          display: 'none',
        },
        '& .MuiTabs-flexContainer': {
          gap: '8px',
        }
      }}
    >
      {hasPermission(role, CONTEXTS.art, SCOPES.canView) ? (
        <Tab label="Obras" component={Link} to="/arts/search" sx={tabStyle} />
      ) : null}
      {hasPermission(role, CONTEXTS.font, multipleScopes) ? (
        <Tab label="Fichas Catalográficas" component={Link} to="/fonts" sx={tabStyle} />
      ) : null}
      {hasPermission(role, CONTEXTS.user, multipleScopes) ? (
        <Tab label="Usuários" component={Link} to="/users" sx={tabStyle} />
      ) : null}
    </Tabs>
  );
};