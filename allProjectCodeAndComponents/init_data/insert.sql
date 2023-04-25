INSERT INTO users (username, password) VALUES ('John Doe', '$2b$10$xkX0HGoWblYQ4hHB314wJe3MFr9UfkBGxsAn9s0jVrmN13jaF6DFq');

INSERT INTO platforms (platform) VALUES ('youtube');
INSERT INTO platforms (platform) VALUES ('vimeo');

INSERT INTO videos (title, platform, description, link) VALUES ('Cat Video', 1, 'meow', 'https://www.youtube.com');
INSERT INTO videos (title, platform, description, link) VALUES ('Cat Video2', 2, 'meow2', 'https://www.vimeo.com');

INSERT INTO users_to_videos (username, movie_id) VALUES ('John Doe', 1);
INSERT INTO users_to_videos (username, movie_id) VALUES ('John Doe', 2);