import './AnalyseProfil.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Connexion from './Connexion';
import Profil from './Profil';
import AnalyseTendance from './AnalyseTendance';
import App from './App';

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

// Nouveau composant pour l'animation de frappe
const TypingText = ({ text, speed = 20 }) => { // speed en millisecondes, 20ms pour un effet rapide
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Réinitialiser le texte si le prop `text` change ou au montage
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
      return () => clearInterval(typingInterval); // Nettoyage au démontage
    }
  }, [text, speed]); // Se déclenche si `text` ou `speed` changent

  // Utilise un div avec whiteSpace: 'pre-wrap' pour respecter les sauts de ligne et les espaces du texte original
  return <div style={{ whiteSpace: 'pre-wrap' }}>{displayedText}</div>;
};


function AnalyseProfil() {
  const [showResult, setShowResult] = useState(false);
  const [page, setPage] = useState('analyseprofil');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];
  const [accountHandle, setAccountHandle] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let handle = accountHandle;
      if (handle.includes('bsky.app/profile/')) {
        handle = handle.substring(handle.lastIndexOf('/') + 1);
      }
      if (handle.startsWith('@')) {
        handle = handle.substring(1);
      }
      const response = await axios.post('http://localhost:5000/vet/account', { account_handle: handle });
      setAnalysisResult(response.data);
      setShowResult(true); // Afficher les résultats en cas de succès
    } catch (err) {
      setError(err.response ? err.response.data.error : "Une erreur s'est produite");
      setShowResult(false);
    }
    setLoading(false);
  };

  // Contenu textuel pour l'animation
  const tweetSummaryContent = analysisResult ? analysisResult.summary : '';

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'profil') {
    return <Profil />;
  }

    if (page === 'analysetendance') {
    return <AnalyseTendance />;
  }

  if (page === 'app') {
    return <App />;
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
          {/* <a href="#" onClick={() => setPage('profil')}>Mon profil</a> */}
          {/* <a href="#" onClick={() => setPage('connexion')}>Se connecter</a> */}
        </nav>
      </header>

      <main className="main-content">
        <h1>Analysez un profil Bluesky avec</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span>
        </h1>

        <input
          type="text"
          placeholder="Insérez le handle d\'un profil Bluesky (ex: @username.bsky.social)"
          className="tweet-input"
          value={accountHandle}
          onChange={(e) => setAccountHandle(e.target.value)}
        />
        <button className="analyze-button" onClick={handleAnalyzeClick} disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Analyser'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {showResult && analysisResult && (
          <>
            <div className="reliability-profil">
              <h2>Nombre de posts analysés : {analysisResult.posts_analyzed_count}</h2>
              <h2>Moyenne de fausses informations : {analysisResult.fake_news_percentage}%</h2>
              <h2>Proportions de posts politiques : {analysisResult.political_posts_percentage}%</h2>
              <h2>Proportions de posts factuels : {analysisResult.factual_posts_percentage}%</h2>
            </div>

            <div className="emotion-profil-box">
              <h2 className="emotion-profil-title">Émotions véhiculées les plus communes</h2>
              <ul className="emotion-profil-list">
                {analysisResult.common_emotions.map((emotion, index) => (
                  <li key={index}><span className="emoji">{emotion.emoji}</span> {emotion.label}</li>
                ))}
              </ul>
            </div>

            <div className="tweet-card">
              <div className="tweet-header">
                  Résumé du profil <span className="tweet-emoji">🔎</span>
              </div>
              <div className="tweet-content">
                <TypingText text={tweetSummaryContent} speed={5} />
              </div>
            </div>
          </>
        )}
      </main>
      <br></br><br></br><br></br>
    </div>
  );
}

export default AnalyseProfil;