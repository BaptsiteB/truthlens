import './Inscription.css';
import React, { useState } from 'react';
import Connexion from './Connexion';
import App from './App';
import Profil from './Profil';

function Inscription() {

  const [page, setPage] = useState('inscription');

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'app') {
    return <App />;
  }

  if (page === 'profil') {
    return <Profil />;
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
          <a href="#" onClick={() => setPage('profil')}>Mon profil</a>
          <a href="#"onClick={() => setPage('connexion')} >Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>Inscrivez vous à</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span> 
        </h1>
      </main>
      
        <div className="inscription-container">
            <form className="inscription-form">
                <label>
                    Email :
                    <input type="email" name="email" required />
                </label>
                <label>
                    Mot de passe :
                    <input type="password" name="password" required />
                </label>
                <button type="submit">Créer un compte</button>
            </form>
        </div>

        <div className="inscription-connexion-container">
          <span className="inscription-connexion-label">Vous possédez déjà un compte ?</span>
          <a
            href="#"
            className="inscription-connexion-link"
            onClick={() => setPage('connexion')}
          >
            Connectez vous !
          </a>
        </div>
    </div>
  );
}

export default Inscription;
