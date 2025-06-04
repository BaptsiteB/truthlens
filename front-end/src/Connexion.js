import './Connexion.css';
import React, { useState, useEffect } from 'react';
import Inscription from './Inscription';
import App from './App';
import Profil from './Profil';
import AnalyseProfil from './AnalyseProfil';
import AnalyseTendance from './AnalyseTendance';


const FallingLetters = ({ words }) => {
  const [instances, setInstances] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const word = words[Math.floor(Math.random() * words.length)];
      const id = Date.now() + Math.random();

      let x;
      let attempts = 0;
      const minDistance = 8; // écart minimum entre deux colonnes (%)

      do {
        x = Math.random() * 90; // évite d'aller au bord droit
        attempts++;
        if (attempts > 20) break; // évite boucle infinie
      } while (
        instances.some(inst => Math.abs(inst.x - x) < minDistance)
      );

      setInstances(prev => [...prev, { word, x, id }]);

      // Clean up après 12s
      setTimeout(() => {
        setInstances(prev => prev.filter(item => item.id !== id));
      }, 12000);
    }, 600);

    return () => clearInterval(interval);
  }, [words, instances]);

  return (
    <div className="falling-container">
      {instances.map(({ word, x, id }) => (
        <div key={id} className="falling-word" style={{ left: `${x}%` }}>
          {word.split('').map((char, i) => (
            <img
              key={i}
              src={`/Lettres/${char.toLowerCase()}.png`}
              alt={char}
              className="falling-letter"
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};



function Connexion() {

  const [page, setPage] = useState('connexion');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];
  

  if (page === 'inscription') {
    return <Inscription />;
  }

    if (page === 'app') {
    return <App />;
  }

  if (page === 'profil') {
    return <Profil />;
  }

    if (page === 'analysetendance') {
    return <AnalyseTendance />;
  }

    if (page === 'analyseprofil') {
    return <AnalyseProfil />;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-title">
          <img src="/truthlens_logo.png" alt="Truth Lens Logo" className="logo" />
          <h3>Truth Lens</h3>
        <FallingLetters words={words} />
    </div>
        <nav className="nav-links">
          <a href="#" onClick={() => setPage('app')}>Posts</a>
          <a href="#" onClick={() => setPage('analyseprofil')}>Profils</a>
          <a href="#" onClick={() => setPage('analysetendance')}>Tendances</a>
          <a href="#" onClick={() => setPage('profil')}>Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')}>Se connecter</a>
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