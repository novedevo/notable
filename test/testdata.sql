INSERT INTO users (id, username, password, name, admin)
VALUES (100, 'admin1', 'adminpass', 'Bobby', TRUE);

INSERT INTO users (id, username, password, name, admin)
VALUES (101, 'testuser1', 'userpass1', 'Jim', FALSE);

INSERT INTO users (id, username, password, name, admin)
VALUES (102, 'testuser2', 'userpass2', 'Jam', FALSE);

INSERT INTO users (id, username, password, name, admin)
VALUES (103, 'testuser3', 'userpass3', 'Joe', FALSE);

INSERT INTO users (id, username, password, name, admin)
VALUES (104, 'throwawayuser', 'throwpass', 'Garbage', FALSE);

INSERT INTO presentations (
    presentation_instance_id,
    title, 
    scheduled_date, 
    presentation_end_date, 
    youtube_url, 
    presenter_id
    )
VALUES (
        102,
        'Test Presentation 1',
        '2022-07-31 10:00:00',
        null,
        'https://www.youtube.com/watch?v=k9J4H5gkLqw',
        100
    );

INSERT INTO presentations (
    presentation_instance_id,
    title, 
    scheduled_date, 
    presentation_end_date, 
    pdf, 
    presenter_id
    )
VALUES (
        103,
        'Test Presentation 2',
        '2022-07-31 10:00:00',
        null,
        'testpdf1',
        100
    );

INSERT INTO presentations (
    presentation_instance_id,
    title, 
    scheduled_date, 
    presentation_end_date, 
    pdf, 
    presenter_id
    )
VALUES (
        104,
        'Test Presentation 3',
        '2022-07-31 10:00:00',
        null,
        'testpdf2',
        101
    );

INSERT INTO presentations (
    presentation_instance_id,
    title, 
    scheduled_date, 
    presentation_end_date, 
    pdf, 
    presenter_id
    )
VALUES (
        105,
        'Test presentation with no notes',
        '2022-07-31 10:00:00',
        null,
        'testpdf3',
        100
    );


INSERT INTO notes (
        note_id,
        note,
        time_stamp,
        notetaker_id,
        presentation_id
    )
VALUES (
        102,
        'This is a test note by user 102 for presentation 1',
        120,
        102,
        102
    );

INSERT INTO notes (
        note_id,
        note,
        time_stamp,
        notetaker_id,
        presentation_id
    )
VALUES (
        103,
        'This is a test note by user 103 for presentation 1',
        290,
        103,
        102
    );


INSERT INTO notes (
        note_id,
        note,
        time_stamp,
        notetaker_id,
        presentation_id
    )
VALUES (
        104,
        'This is a test note by user 104 for presentation 2',
        290,
        104,
        103
    );
    

INSERT INTO notes (
        note_id,
        note,
        time_stamp,
        notetaker_id,
        presentation_id,
        visible
    )
VALUES (
        105,
        'This is a test note by user 102 for presentation 3',
        290,
        102,
        104,
        FALSE
    );

INSERT INTO notes (
        note_id,
        note,
        time_stamp,
        notetaker_id,
        presentation_id,
        visible
    )
VALUES (
        106,
        'This should be a non-visible test note by user 102 for presentation 4',
        400,
        102,
        105,
        FALSE
    );