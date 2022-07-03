CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL
);
ALTER USER postgres PASSWORD 'postgres';

CREATE TABLE IF NOT EXISTS notes (
    note_id SERIAL PRIMARY KEY,
    note TEXT,
    notetaker_id integer REFERENCES users (id)
);