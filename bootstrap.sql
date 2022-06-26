CREATE TABLE users (
    id SERIAL,
    username TEXT NOT NULL,
    password TEXT NOT NULL
);
ALTER USER postgres PASSWORD 'postgres';