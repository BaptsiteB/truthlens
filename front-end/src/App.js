import './App.css';
import React, { useState } from 'react';
import Connexion from './Connexion';
import Profil from './Profil';

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

function App() {
  const [score_barre, setScoreBarre] = useState(fiabilite_score);
  const [showTweet, setShowTweet] = useState(false);
  const [page, setPage] = useState('app');

  const handleAnalyzeClick = () => {
    setShowTweet(true); // simulation
  };

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'profil') {
    return <Profil />;
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
        </div>
        <nav className="nav-links">
          <a href="#" onClick={() => setPage('accueil')}>Accueil</a>
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
