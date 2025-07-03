import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Importer axios
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

const getEmotionEmoji = (emotion) => {
  switch (emotion) {
    case 'Surprise':
      return '😮';
    case 'Anticipation':
      return '🤔';
    case 'Fear':
      return '😨';
    case 'Joy':
      return '😄';
    case 'Sadness':
      return '😢';
    case 'Anger':
      return '😠';
    case 'Disgust':
      return '🤢';
    case 'Trust':
      return '🤗';
    default:
      return '❓';
  }
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
  const [score_barre, setScoreBarre] = useState(0); // Initialiser à 0
  const [showTweet, setShowTweet] = useState(false);
  const [page, setPage] = useState('app');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];
  const [postUrl, setPostUrl] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyzeClick = async () => {
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    setShowTweet(false);

    try {
      const response = await axios.post('http://localhost:5000/vet/post', { url: postUrl });
      setAnalysisResult(response.data);
      setScoreBarre(response.data.fiabilite_score); // Mettre à jour la barre de score
      setShowTweet(true);
    } catch (err) {
      setError(err.response ? err.response.data.error : "Une erreur s'est produite");
      setShowTweet(false);
    }
    setLoading(false);
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
        <h2>Le meilleur site pour analyser la véracité d'un post</h2>

        <input
          type="text"
          placeholder="Insérez le lien d'un post Bluesky"
          className="tweet-input"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
        />
        <button className="analyze-button" onClick={handleAnalyzeClick} disabled={loading}>
          {loading ? 'Analyse en cours...' : 'Analyser'}
        </button>

        {error && <div className="error-message">{error}</div>}

        {showTweet && analysisResult && (
          <>
            <div className="tweet-card">
              <div className="tweet-header">
                <span className="tweet-author">
                  {analysisResult.post_details?.author.displayName} <span className="tweet-emoji">🦋</span>
                </span>
                <span className="tweet-username">@{analysisResult.post_details?.author.handle}</span>
              </div>
              <div className="tweet-content">
                {analysisResult.post_details?.text}
              </div>
              <div className="tweet-date">
                 {new Date(analysisResult.post_details?.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="reliability">
              <h2>Fiabilité : {analysisResult.fiabilite_score}%</h2>
              <div className="heart-bar">{renderHeartBar(analysisResult.fiabilite_score)}</div>
            </div>

            <div className="emotion-box">
              <h2 className="emotion-title">Émotions engendrées</h2>
              <ul className="emotion-list">
                {analysisResult.emotions.map((emotion, index) => (
                  <li key={index}><span className="emoji">{getEmotionEmoji(emotion)}</span> {emotion}</li>
                ))}
              </ul>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
