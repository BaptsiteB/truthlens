import './Connexion.css';
import React, { useState } from 'react';

function App() {

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
        <h1>
          Connectez vous à 
        </h1>
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
    </div>

    
  );
  
}

export default App;
