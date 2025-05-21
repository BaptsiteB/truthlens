import './App.css';

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <img src="/truthlens_logo.png" alt="Truth Lens Logo" className="logo" />
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
        <button className="analyze-button">Analyser</button>
      </main>
    </div>
  );
}

export default App;
