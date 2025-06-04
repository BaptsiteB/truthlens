import './AnalyseProfil.css';
import React, { useState, useEffect } from 'react';
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


function AnalyseProfil() {
  const [showTweet, setShowTweet] = useState(false);
  const [page, setPage] = useState('analyseprofil');
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
          <a href="#" onClick={() => setPage('profil')}>Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')}>Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>Analysez un profil Bluesky avec</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span>
        </h1>

        <input
          type="text"
          placeholder="Insérez le lien d'un profil Bluesky"
          className="tweet-input"
        />
        <button className="analyze-button" onClick={handleAnalyzeClick}>
          Analyser
        </button>

        {showTweet && (
          <>
            <div className="reliability-profil">
              <h2>Nombre de posts analysés : 50</h2>
              <h2>Moyenne de fausses informations : 21</h2>
              <h2>Proportions de posts politiques : 36%</h2>
              <h2>Proportions de posts factuels : 55%</h2>
            </div>

            <div className="emotion-profil-box">
              <h2 className="emotion-profil-title">Émotions véhiculées les plus communes</h2>
              <ul className="emotion-profil-list">
                <li><span className="emoji">🤣</span> Humour</li>
                <li><span className="emoji">😲</span> Surprise</li>
                <li><span className="emoji">😎</span> Tranquillité</li>
              </ul>
            </div>

            <div className="tweet-card">
              <div className="tweet-header">
                  Résumé du profil <span className="tweet-emoji">🔎</span>
              </div>
              <div className="tweet-content">
                This Bluesky account exhibits a blend of technological, political, and economic commentary, with a significant focus on the impact of AI and blockchain technology.  It's not strictly personal, but the author's opinions and experiences are woven throughout.\n\n**Recurring Themes and Keywords:**\n\n* **AI and its impact:** The author frequently discusses the transformative potential of AI, covering topics like AI-assisted writing, patent applications, job displacement, and its educational applications for children. Keywords include \"AI,\" \"ChatGPT,\" \"Gemini,\" \"prompt engineering,\"  \"critical thinking.\"\n* **Blockchain technology:**  The account advocates for blockchain's uses in database management and security, contrasting it with traditional database systems.  Keywords include \"blockchain,\" \"database,\" \"security,\" \"crypto.\"\n* **Political commentary:**  The account touches upon US politics, including discussions of Republican policies, ICE actions, and the impact of tariffs. Keywords include \"ICE,\" \"Republicans,\" \"Trump,\" \"tariffs.\"\n* **Economic analysis:** The author comments on economic trends, including the impact of AI on employment,  the shrinking US economy, and the effects of government policies. Keywords include \"economy,\" \"jobs,\" \"layoffs,\" \"tariffs.\"\n\n**Overall:** The account presents a perspective informed by technological expertise and a critical view of current political and economic events. The author frequently shares news articles and links, demonstrating an interest in staying updated on current affairs and disseminating information.
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
