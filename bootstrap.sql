DROP TABLE users CASCADE;
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
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
    title TEXT NOT NULL,
    scheduled_date TIMESTAMP(0),
    presentation_end_date TIMESTAMP(0),
    youtube_url TEXT,
    pdf TEXT,
    presenter_id integer REFERENCES users (id) NOT NULL
);
INSERT INTO presentations (
        title,
        scheduled_date,
        presentation_end_date,
        youtube_url,
        presenter_id
    )
VALUES (
        'Example Presentation',
        '2022-07-19 10:00:00',
        null,
        'https://youtube.com/watch?v=LEENEFaVUzU',
        1
    );
DROP TABLE notes CASCADE;
CREATE TABLE notes (
    note_id SERIAL PRIMARY KEY,
    note TEXT,
    time_stamp integer,
    page_number TEXT,
    notetaker_id integer REFERENCES users (id),
    presentation_id integer REFERENCES presentations (presentation_instance_id),
    visible BOOLEAN NOT NULL DEFAULT TRUE
);
INSERT INTO notes (
        note,
        time_stamp,
        notetaker_id,
        presentation_id
    )
VALUES (
        'This is an example note',
        120,
        2,
        1
    );