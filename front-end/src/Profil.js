import './Profil.css';
import React, { useState } from 'react';
import App from './App';
import Connexion from './Connexion';

function Profil() {

  const [page, setPage] = useState('profil');

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'app') {
    return <App />;
  }
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-title">
          <img src="/truthlens_logo.png" alt="Truth Lens Logo" className="logo" />
          <h3>Truth Lens</h3>
        </div>
        <nav className="nav-links">
          <a href="#" onClick={() => setPage('app')} >Accueil</a>
          <a href="#" >Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')} >Se connecter</a>
        </nav>
      </header>
    </div>
  );
}

export default Profil;