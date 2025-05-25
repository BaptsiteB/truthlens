import './Connexion.css';
import React, { useState } from 'react';
import Inscription from './Inscription';
import App from './App';

function Connexion() {

  const [page, setPage] = useState('connexion');
  

  if (page === 'inscription') {
    return <Inscription />;
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
          <a href="#">Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>Connectez-vous à</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span>
        </h1>
      </main>

      <div className="connexion-container">
        <form className="connexion-form">
          <label>
            Email :
            <input type="email" name="email" required />
          </label>
          <label>
            Mot de passe :
            <input type="password" name="password" required />
          </label>
          <button type="submit">Se connecter</button>
        </form>
      </div>

      <div className="connexion-inscription-container">
        <span className="inscription-label">Pas encore de compte ?</span>
        <a
          href="#"
          className="connexion-inscription-link"
          onClick={() => setPage('inscription')}
        >
          Inscrivez-vous !
        </a>
      </div>
    </div>
  );
}

export default Connexion;