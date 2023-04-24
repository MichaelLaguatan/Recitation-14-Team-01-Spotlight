INSERT INTO users (username, password) VALUES ('John Doe', '$2b$10$xkX0HGoWblYQ4hHB314wJe3MFr9UfkBGxsAn9s0jVrmN13jaF6DFq');

INSERT INTO videos (title, release, views, link) VALUES ('Cat Video', 04262022, 200, 'https://www.youtube.com');
INSERT INTO videos (title, release, views, link) VALUES ('Cat Video2', 04272022, 2000, 'https://www.youtube.com');

INSERT INTO users_to_videos (username, movie_id) VALUES ('John Doe', 1);
INSERT INTO users_to_videos (username, movie_id) VALUES ('John Doe', 2);