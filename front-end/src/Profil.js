import './Profil.css';
import React, { useState, useEffect } from 'react';
import App from './App';
import Connexion from './Connexion';


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


function Profil() {

  const [page, setPage] = useState('profil');
  const words = ['estebanmartel', 'baptistebilla', 'viveladata', 'projettruthlens'];

  // Données simulées (ex: récupérées côté backend normalement)
  const tweetsAnalyses = [
    {
      id: 1,
      contenu: "there are three movies explaining what happens at night to the museums",
      auteur: "trin",
      date: "1:42 AM · Mar 11, 2021",
      handle: "@loveltrin"
    },
    {
      id: 2,
      contenu: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod...",
      auteur: "Your Name",
      date: "1:42 AM · Mar 11, 2021",
      handle: "@UserNameHere"
    },
    {
      id: 3,
      contenu: "logging on for my shift at the posting factory",
      auteur: "Emily 🦋",
      date: "Jul 3, 2023 at 11:11 AM",
      handle: "@emilyliu.me"
    },
    {
      id: 4,
      contenu: "another example tweet for testing row wrapping",
      auteur: "Tester",
      date: "Feb 5, 2024",
      handle: "@tester"
    },
    {
      id: 5,
      contenu: "fifth tweet showing correct layout",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    },
        {
      id: 6,
      contenu: "test 6",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    }, 
        {
      id: 7,
      contenu: "test 7",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    }, 
        {
      id: 8,
      contenu: "test 8",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    },     {
      id: 9,
      contenu: "test 9",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    }, 
        {
      id: 10,
      contenu: "test 10",
      auteur: "LayoutBot",
      date: "Apr 1, 2024",
      handle: "@layoutbot"
    }
  ];

  if (page === 'connexion') {
    return <Connexion />;
  }

  if (page === 'app') {
    return <App />;
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
          <a href="#" onClick={() => setPage('app')} >Accueil</a>
          <a href="#">Mon profil</a>
          <a href="#" onClick={() => setPage('connexion')} >Se connecter</a>
        </nav>
      </header>

      <main className="main-content">
        <h1>Mon Profil</h1>
        <h1>
          <span className="triforce-font">Truth Lens</span>
        </h1>

        <div className="Informations-Utilisateur">
          <h2>Mes informations</h2>
          <label>Nom d'Utilisateur :</label><br />
          <label>Email :</label>
        </div>

        <div className="Historique-analyses">
          <h2>Historique des analyses</h2>
          <div className="tweet-grid">
            {tweetsAnalyses.map((tweet) => (
              <div key={tweet.id} className="tweet-card">
                <strong>{tweet.auteur}</strong><br />
                <span className="tweet-handle">{tweet.handle}</span>
                <p>{tweet.contenu}</p>
                <span className="tweet-date">{tweet.date}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Profil;
