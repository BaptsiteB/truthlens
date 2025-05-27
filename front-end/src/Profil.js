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

      <main className="main-content">
        <h1>Mon Profil</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span>
        </h1>
        <div className="Informations-Utilisateur">
          <h2>Mes informations</h2>
          <label>Nom d'Utilisateur : </label> <br/>
          <label>Email : </label>
        </div>
        
        <br/><br/><br/><br/><br/>
        
        <div className="Historique-analyses">
          <h2>Historique des analyses</h2>
        </div>
      </main>
    </div>
  );
}

export default Profil;