import './App.css';
import { useContext, useEffect, useState } from 'react';
import { Route, Routes, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Contact from './components/AboutUs/Contact/Contact';
import Projetos from './components/AboutUs/Projetos/Projetos';
import { TheNavBar } from './components/TheNavBar/TheNavBar';

import { AuthContext } from './contexts/auth';

import { SearchArtwork } from './pages/Arts/Search/SearchArtwork';
import { Art } from './pages/Arts/SingleArt/Art';
import { ChangePassword } from './pages/ChangePassword/ChangePassword';
import Fonts from './pages/Fonts/Fonts';
import Landing from './pages/Landing/Landing';
import Login from './pages/Login/Login';
import Users from './pages/Users/Users';
import { deleteSession } from './services/api';
import { SCOPES, CONTEXTS, hasPermission } from './services/permissions';

export default function App() {
  const [id, setId] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setId(sessionStorage.getItem('connect.sid'));
    setRole(sessionStorage.getItem('connect.srole'));
    setLoading(false);
  }, []);

  const logout = () => {
    try {
      deleteSession();
      sessionStorage.removeItem('connect.sid');
      sessionStorage.removeItem('connect.srole');
      setId('');
      setRole('');
      navigate('/', { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  const Private = ({ children, context }) => {
    const { authenticated, loading, role } = useContext(AuthContext);
    if (loading) {
      return <div />;
    }
    if (!authenticated) {
      return <Navigate to="/" />;
    }
    if (!hasPermission(role, context, SCOPES.canView)) {
      return <Navigate to="/arts/search" />;
    }
    return children;
  };
  return (
    <div style={{ fontSize: `${fontSize}px` }}>
    <AuthContext.Provider value={{ authenticated: !!id, id, role, setId, setRole, loading, logout }}>
      {id && !['/', '/contato', '/projetos', '/login'].includes(pathname) && <TheNavBar pathname={pathname} setFontSize={setFontSize} />}
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route
          path="/fonts"
          element={
            <Private context={CONTEXTS.font}>
              <Fonts />
            </Private>
          }
        />

        <Route
          path="/arts"
          element={
            <Private context={CONTEXTS.art}>
              <SearchArtwork />
            </Private>
          }
        />

        <Route
          exact path="/arts/search"
          element={
            <Private context={CONTEXTS.art}>
              <SearchArtwork />
            </Private>
          }
        />

        <Route
          path="/arts/:artId"
          element={
            <Private context={CONTEXTS.art}>
              <Art />
            </Private>
          }
        />
        <Route
          path="/users"
          element={
            <Private context={CONTEXTS.user}>
              <Users />
            </Private>
          }
        />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/projetos" element={<Projetos />} />
        <Route path="/contato" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthContext.Provider>
    </div>
  );
}
