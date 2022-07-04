DROP TABLE users;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO users (username, password, name, admin)
VALUES ('admin', 'admin', 'Admin', TRUE);
INSERT INTO users (username, password, name, admin)
VALUES ('user', 'user', 'User', FALSE);

DROP TABLE notes;
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    note TEXT,
    notetaker_id integer REFERENCES users (id)
);