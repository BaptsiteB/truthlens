import './Inscription.css';
import React, { useState } from 'react';
import Connexion from './Connexion';

function Inscription() {

  const [page, setPage] = useState('inscription');

  // Si on clique sur "Connectez-vous", on affiche la page de connection
  if (page === 'connexion') {
    return <Connexion />;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-title">
          <img src="/truthlens_logo.png" alt="Truth Lens Logo" className="logo" />
          <h3>Truth Lens</h3>
        </div>
        <nav className="nav-links">
          <a href="#">Accueil</a>
          <a href="#">Mon profil</a>
          <a href="#">Se connecter</a>
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
          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            Vous possédez déjà un compte ?{' '}
            <a href="#" onClick={() => setPage('connexion')}>Connectez-vous !</a>
          </p>
    </div>

    
  );
  
}

export default Inscription;
