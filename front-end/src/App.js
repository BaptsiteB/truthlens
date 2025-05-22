import './App.css';
import React, { useState } from 'react';

function App() {

  const [showTweet, setShowTweet] = useState(false);

  const handleAnalyzeClick = () => {
    setShowTweet(true); // simulation de réponse
  };

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
          <div className="tweet-card">
            <div className="tweet-header">
              <span className="tweet-author">Emily <span className="tweet-emoji">🦋</span></span>
              <span className="tweet-username">@emilyliu.me</span>
            </div>
            <div className="tweet-content">
              logging on for my shift at the posting factory
            </div>
            <div className="tweet-date">
              Jul 3, 2023 at 11:11 AM
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
