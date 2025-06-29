import './AnalyseTendance.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Connexion from './Connexion';
import Profil from './Profil';
import AnalyseProfil from './AnalyseProfil';
import App from './App';

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


const TypingText = ({ text, speed = 20 }) => { 
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); 
    if (text) {
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < text.length) {
          setDisplayedText(prevText => prevText + text.charAt(i));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, speed);
      return () => clearInterval(typingInterval); 
    }
  }, [text, speed]); 

  return <div style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</div>;
};


function AnalyseTendance() {
  const [showResult, setShowResult] = useState(false);
  const [page, setPage] = useState('analysetendance');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setShowResult(false);

    try {
      const response = await axios.get('http://localhost:5000/vet/trend');
      setAnalysisResult(response.data);
      setShowResult(true);
    } catch (err) {
      setError(err.response ? err.response.data.error : "Une erreur s'est produite");
      setShowResult(false);
    }
    setLoading(false);
  };

  if (page === 'app') {
    return <App />;
  }
  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'profil') {
    return <Profil />;
  }

  if (page === 'analyseprofil') {
    return <AnalyseProfil />;
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
          <a href="#" onClick={() => setPage('app')}>Posts</a>
          <a href="#" onClick={() => setPage('analyseprofil')}>Profils</a>
          <a href="#" onClick={() => setPage('analysetendance')}>Tendances</a>
          <a href="#" onClick={() => setPage('profil')}>Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')}>Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>
          Analyse des tendances sur <span className="triforce-font">Truth Lens</span>
        </h1>
        <h2>Cliquez sur le bouton pour découvrir les sujets populaires sur Bluesky</h2>

        <button className="analyze-button" onClick={handleAnalyzeClick} disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Analyser les tendances'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {showResult && analysisResult && (
          <>
            <div className="tweet-card">
              <div className="tweet-header">
                Analyse des tendances <span className="tweet-emoji">📈</span>
              </div>
              <div className="tweet-content">
                <TypingText text={analysisResult.analyse_brute} speed={5} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default AnalyseTendance;
