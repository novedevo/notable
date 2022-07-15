DROP TABLE users CASCADE;
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

DROP TABLE presentations CASCADE;
CREATE TABLE presentations (
    presentation_instance_id SERIAL PRIMARY KEY,
    title TEXT,
    scheduled_date TIMESTAMP(0),
    youtube_url TEXT,
    pdf TEXT,
    presenter_id integer REFERENCES users (id)
);

DROP TABLE notes CASCADE;
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    note TEXT,
    notetaker_id integer REFERENCES users (id),
    presentation_id integer REFERENCES presentations (presentation_instance_id)
);