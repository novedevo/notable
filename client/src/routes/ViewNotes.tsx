import axios from "axios";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const ViewNotes = () => {

    const [notes, setNotes] = useState<any[]>([]);
    useEffect(() => {
        fetchNotesSet();
    }, []);

    const fetchNotesSet = () => {
        axios
        .get("/api/get_noteSet")
        .then((res) => {
            console.log(res);
            setNotes(res.data);
        })
        .catch((err => {
            console.log(err);
        }))
    }

    return (
        <div>
            <h1>View Notes</h1>
            <div id="noteSets_container">
                {notes.map((note) => (
                    <Link to="/pdf" state={{notes: "notes"}} id="noteSet">
                        <p>{note.title}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}
export default ViewNotes