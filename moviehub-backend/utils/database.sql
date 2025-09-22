-- Drop existing tables if they exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS votes CASCADE;
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role VARCHAR(20) DEFAULT 'user', 
    created_at TIMESTAMP DEFAULT NOW()
);

-- Movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    added_by INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    vote_count INT DEFAULT 0,
    UNIQUE(title, added_by)
);

-- Votes table
CREATE TABLE votes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    vote_type INT NOT NULL CHECK (vote_type IN (1, -1)), 
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);




INSERT INTO users (id, name, email, password) VALUES
(2, 'Alice', 'alice@example.com', 'hashedpassword'),
(3, 'Bob', 'bob@example.com', 'hashedpassword'),
(4, 'Charlie', 'charlie@example.com', 'hashedpassword'),
(1, 'AdminUser', 'admin@example.com', 'hashedpassword');



-- Existing 4 users + Admin
-- Adding 6 more users
INSERT INTO users (id, name, email, password) VALUES
(5, 'David', 'david@example.com', 'hashedpassword'),
(6, 'Eve', 'eve@example.com', 'hashedpassword'),
(7, 'Frank', 'frank@example.com', 'hashedpassword'),
(8, 'Grace', 'grace@example.com', 'hashedpassword'),
(9, 'Hannah', 'hannah@example.com', 'hashedpassword'),
(10, 'Ivan', 'ivan@example.com', 'hashedpassword');


INSERT INTO movies (id, title, description, added_by, created_at, vote_count) VALUES
(1, 'The Great Adventure', 'An epic adventure movie.', 2, '2025-09-20', 5),
(2, 'Horror Night', 'Scary movie with twists.', 3, '2025-09-19', 2),
(3, 'Comedy Club', 'A fun comedy film.', 4, '2025-09-18', 8),
(4, 'Romantic Escape', 'Love story with drama.', 2, '2025-09-17', 1),
(5, 'Sci-Fi Galaxy', 'Futuristic sci-fi adventure.', 3, '2025-09-16', 10);


-- Movie 1 votes
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
(2, 1, 1), -- Alice upvoted
(3, 1, 1), -- Bob upvoted
(4, 1, 1), -- Charlie upvoted
(1, 1, 1), -- Admin upvoted
(3, 3, 1); -- Bob upvoted Movie 3

-- Movie 2 votes
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
(2, 2, 1),
(4, 2, -1);

-- Movie 3 votes
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
(2, 3, 1),
(4, 3, 1);

-- Movie 4 votes
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
(2, 4, -1);

-- Movie 5 votes
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
(1, 5, 1),
(2, 5, 1),
(3, 5, 1),
(4, 5, 1);


INSERT INTO comments (id, movie_id, user_id, body, created_at) VALUES
(1, 1, 2, 'Amazing movie, loved the adventure!', '2025-09-20 10:00:00'),
(2, 1, 3, 'Good but could be shorter.', '2025-09-20 10:05:00'),
(3, 2, 4, 'Too scary for me!', '2025-09-19 12:00:00'),
(4, 3, 2, 'Hilarious, laughed a lot!', '2025-09-18 15:00:00'),
(5, 4, 3, 'Romantic but predictable.', '2025-09-17 18:00:00'),
(6, 5, 1, 'Best sci-fi movie ever!', '2025-09-16 20:00:00');






-- Existing 5 movies + 5 more
INSERT INTO movies (id, title, description, added_by, created_at, vote_count) VALUES
(6, 'Mystery Manor', 'Intriguing mystery thriller.', 5, '2025-09-15', 3),
(7, 'Animated Fun', 'Fun for the whole family.', 6, '2025-09-14', 6),
(8, 'Documentary Life', 'Insightful documentary.', 7, '2025-09-13', 2),
(9, 'Fantasy Realm', 'Magical fantasy adventure.', 8, '2025-09-12', 7),
(10, 'Action Blast', 'High-octane action movie.', 9, '2025-09-11', 4);


-- Adding votes for new movies
INSERT INTO votes (user_id, movie_id, vote_type) VALUES
-- Movie 6
(2, 6, 1), (3, 6, 1), (4, 6, -1), (5, 6, 1), (1, 6, 1),

-- Movie 7
(2, 7, 1), (3, 7, 1), (6, 7, 1), (7, 7, -1), (1, 7, 1),

-- Movie 8
(8, 8, 1), (2, 8, -1), (3, 8, 1),

-- Movie 9
(1, 9, 1), (4, 9, 1), (5, 9, 1), (6, 9, -1), (7, 9, 1),

-- Movie 10
(3, 10, 1), (4, 10, 1), (5, 10, -1), (6, 10, 1);


-- Adding comments for new movies
INSERT INTO comments (id, movie_id, user_id, body, created_at) VALUES
(7, 6, 5, 'Thrilling but confusing at times.', '2025-09-15 10:00:00'),
(8, 6, 2, 'Loved the mystery!', '2025-09-15 11:00:00'),
(9, 7, 6, 'Perfect for kids.', '2025-09-14 09:00:00'),
(10, 7, 3, 'Enjoyed the animation style.', '2025-09-14 10:00:00'),
(11, 8, 7, 'Very informative documentary.', '2025-09-13 12:00:00'),
(12, 9, 8, 'Amazing fantasy world.', '2025-09-12 14:00:00'),
(13, 9, 1, 'Loved the magic elements.', '2025-09-12 15:00:00'),
(14, 10, 3, 'Non-stop action!', '2025-09-11 16:00:00'),
(15, 10, 6, 'A bit too violent for me.', '2025-09-11 17:00:00');



select * from users;
select * from movies;
select * from votes;
select * from comments;

UPDATE users
SET role = 'admin'
WHERE name = 'Alice';

