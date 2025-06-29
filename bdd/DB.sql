-- Table pour les utilisateurs du système
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    email VARCHAR(200) NOT NULL,
    password VARCHAR(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les auteurs des posts
CREATE TABLE IF NOT EXISTS author (
    url VARCHAR(200) PRIMARY KEY NOT NULL,
    name VARCHAR(200),
    total_post_analysed INT DEFAULT 0,
    average_fake_new_percentage DOUBLE,
    proportion_political_post DOUBLE,
    proportion_factual_post DOUBLE,
    topic_summary TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les émotions
CREATE TABLE IF NOT EXISTS emotion (
    id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(200) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table pour les posts
CREATE TABLE IF NOT EXISTS post (
    url VARCHAR(200) NOT NULL PRIMARY KEY,
    text TEXT,
    author_url VARCHAR(200) NOT NULL,
    user_id INT NOT NULL,
    creation_date DATETIME,
    is_political BOOLEAN,
    contains_false_info BOOLEAN,
    fake_new_percentage DOUBLE,
    justification VARCHAR(200),
    FOREIGN KEY (author_url) REFERENCES author(url) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de jonction : analyse des posts par les utilisateurs
CREATE TABLE IF NOT EXISTS analyse_post (
    user_id INT NOT NULL,
    post_url VARCHAR(200) NOT NULL,
    PRIMARY KEY (user_id, post_url),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_url) REFERENCES post(url) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de jonction : émotions associées aux posts
CREATE TABLE IF NOT EXISTS posts_emotions (
    post_url VARCHAR(200) NOT NULL,
    emotion_id INT NOT NULL,
    PRIMARY KEY (post_url, emotion_id),
    FOREIGN KEY (post_url) REFERENCES post(url) ON DELETE CASCADE,
    FOREIGN KEY (emotion_id) REFERENCES emotion(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de jonction : analyse des auteurs par les utilisateurs
CREATE TABLE IF NOT EXISTS analyse_author (
    user_id INT NOT NULL,
    author_url VARCHAR(200) NOT NULL,
    PRIMARY KEY (user_id, author_url),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_url) REFERENCES author(url) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table de jonction : émotions véhiculées par les auteurs
CREATE TABLE IF NOT EXISTS author_emotions (
    author_url VARCHAR(200) NOT NULL,
    emotion_id INT NOT NULL,
    PRIMARY KEY (author_url, emotion_id),
    FOREIGN KEY (author_url) REFERENCES author(url) ON DELETE CASCADE,
    FOREIGN KEY (emotion_id) REFERENCES emotion(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index (sans IF NOT EXISTS, car MySQL ne le supporte pas)
CREATE INDEX idx_post_author_url ON post(author_url);
CREATE INDEX idx_post_user_id ON post(user_id);

CREATE INDEX idx_analyse_post_post_url ON analyse_post(post_url);
CREATE INDEX idx_analyse_post_user_id ON analyse_post(user_id);

CREATE INDEX idx_posts_emotions_emotion_id ON posts_emotions(emotion_id);
CREATE INDEX idx_posts_emotions_post_url ON posts_emotions(post_url);

CREATE INDEX idx_analyse_author_author_url ON analyse_author(author_url);
CREATE INDEX idx_analyse_author_user_id ON analyse_author(user_id);

CREATE INDEX idx_author_emotions_emotion_id ON author_emotions(emotion_id);
CREATE INDEX idx_author_emotions_author_url ON author_emotions(author_url);
