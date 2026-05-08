import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AboutUs/Home/Home.css";

export default function AboutUsLayout({ children, activePage, onLoginClick }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem("cedomca-font-size") || "normal");

  useEffect(() => {
    localStorage.setItem("cedomca-font-size", fontSize);
  }, [fontSize]);

  const fontSizeMap = {
    small: "13px",
    normal: "15px",
    large: "18px",
  };

  return (
    <div className="home-root" style={{ "--base-font-size": fontSizeMap[fontSize], fontSize: "var(--base-font-size)" }}>
      {/* HEADER */}
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

        <div className="home-font-controls">
          <span className="font-label">Fonte:</span>
          <button
            className={`font-btn${fontSize === "small" ? " active" : ""}`}
            onClick={() => setFontSize("small")}
          >
            A-
          </button>
          <button
            className={`font-btn${fontSize === "normal" ? " active" : ""}`}
            onClick={() => setFontSize("normal")}
          >
            A
          </button>
          <button
            className={`font-btn${fontSize === "large" ? " active" : ""}`}
            onClick={() => setFontSize("large")}
          >
            A+
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav className="home-nav">
        <Link to="/" className={`nav-link${activePage === 'acervo' ? ' active' : ''}`}>
          Acervo
        </Link>
        <Link to="/projetos" className={`nav-link${activePage === 'projetos' ? ' active' : ''}`}>
          Projetos
        </Link>
        <Link to="/contato" className={`nav-link${activePage === 'contato' ? ' active' : ''}`}>
          Contato
        </Link>
        {onLoginClick ? (
          <button
            className={`nav-link${activePage === 'login' ? ' active' : ''}`}
            onClick={onLoginClick}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Login
          </button>
        ) : (
          <Link to="/login" className={`nav-link${activePage === 'login' ? ' active' : ''}`}>
            Login
          </Link>
        )}
      </nav>
      
      {/* MAIN CONTENT */}
      {children}

      {/* Help button */}
      <button className="home-help-btn" title="Ajuda">
        ?
      </button>
    </div>
  );
}