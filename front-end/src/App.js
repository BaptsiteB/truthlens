import './App.css';
import React, { useState, useEffect } from 'react';
import Connexion from './Connexion';
import Profil from './Profil';
import AnalyseProfil from './AnalyseProfil';
import AnalyseTendance from './AnalyseTendance';

let fiabilite_score = 20;

if (fiabilite_score > 100) {
  fiabilite_score = 100;
} else if (fiabilite_score < 0) {
  fiabilite_score = 0;
}

const renderHeartBar = (score) => {
  const fullHearts = Math.floor(score / 10);
  const remainder = score % 10;

  let halfHeart = 0;
  if (remainder >= 5) {
    halfHeart = 1;
  }

  const blackHearts = 10 - fullHearts - halfHeart;

  const hearts = [];

  for (let i = 0; i < fullHearts; i++) {
    hearts.push(
      <img
        key={`red-${i}`}
        src="/coeur_rouge.png"
        alt="coeur rouge"
        className="heart"
      />
    );
  }

  if (halfHeart) {
    hearts.push(
      <img
        key="half"
        src="/coeur_demi.png"
        alt="coeur demi"
        className="heart"
      />
    );
  }

  for (let i = 0; i < blackHearts; i++) {
    hearts.push(
      <img
        key={`black-${i}`}
        src="/coeur_noir.png"
        alt="coeur noir"
        className="heart"
      />
    );
  }

  return hearts;
};


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


function App() {
  const [score_barre, setScoreBarre] = useState(fiabilite_score);
  const [showTweet, setShowTweet] = useState(false);
  const [page, setPage] = useState('app');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];

  const handleAnalyzeClick = () => {
    setShowTweet(true); // simulation
  };

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'profil') {
    return <Profil />;
  }

  if (page === 'analyseprofil') {
    return <AnalyseProfil />;
  }

  if (page === 'analysetendance') {
    return <AnalyseTendance />;
  }

  return (
    <div className="app">
      <header className="navbar">
        <div className="logo-title">
          <img
            src="/truthlens_logo.png"
            alt="Truth Lens Logo"
            className="logo"
          />
          <h3>Truth Lens</h3>
          <FallingLetters words={words} />
        </div>
        <nav className="nav-links">
          <a href="#" onClick={() => setPage('accueil')}>Posts</a>
          <a href="#" onClick={() => setPage('analyseprofil')}>Profils</a>
          <a href="#" onClick={() => setPage('analysetendance')}>Tendances</a>
          <a href="#" onClick={() => setPage('profil')}>Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')}>Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>
          Bienvenue sur <span className="triforce-font">Truth Lens</span>
        </h1>
        <h2>Le meilleur site pour analyser la véracité d'un tweet</h2>

        <input
          type="text"
          placeholder="Insérez le lien d'un tweet"
          className="tweet-input"
        />
        <button className="analyze-button" onClick={handleAnalyzeClick}>
          Analyser
        </button>

        {showTweet && (
          <>
            <div className="tweet-card">
              <div className="tweet-header">
                <span className="tweet-author">
                  Emily <span className="tweet-emoji">🦋</span>
                </span>
                <span className="tweet-username">@emilyliu.me</span>
              </div>
              <div className="tweet-content">
                logging on for my shift at the posting factory
              </div>
              <div className="tweet-date">
                Jul 3, 2023 at 11:11 AM
              </div>
            </div>

            <div className="reliability">
              <h2>Fiabilité : {score_barre}%</h2>
              <div className="heart-bar">{renderHeartBar(score_barre)}</div>
            </div>

            <div className="emotion-box">
              <h2 className="emotion-title">Émotions engendrées</h2>
              <ul className="emotion-list">
                <li><span className="emoji">🤣</span> Humour</li>
                <li><span className="emoji">😲</span> Surprise</li>
                <li><span className="emoji">😎</span> Tranquillité</li>
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
