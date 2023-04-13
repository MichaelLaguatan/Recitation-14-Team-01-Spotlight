DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
    username VARCHAR(50) PRIMARY KEY,
    password CHAR(60) NOT NULL
);

DROP TABLE IF EXISTS videos CASCADE;
CREATE TABLE videos(
    video_id SERIAL PRIMARY KEY NOT NULL,
    title text,
    release INT,
    views INT,
    link text
);

DROP TABLE IF EXISTS tags CASCADE;
CREATE TABLE tags(
    tag_id SERIAL SERIAL PRIMARY KEY NOT NULL,
    tag VARCHAR(20),
);

DROP TABLE IF EXISTS users_to_videos CASCADE;
CREATE TABLE users_to_videos(
    username VARCHAR(50),
    movie_id INT,
    FOREIGN KEY (username) REFERENCES users (username),
    FOREIGN KEY (movie_id) REFERENCES videos (video_id),
);

DROP TABLE IF EXISTS videos_to_tags CASCADE;
CREATE TABLE users_to_videos(
    video_id INT,
    tag_id INT,
    FOREIGN KEY (video_id) REFERENCES videos (video_id),
    FOREIGN KEY (tag_id) REFERENCES tags (tag_id),
);