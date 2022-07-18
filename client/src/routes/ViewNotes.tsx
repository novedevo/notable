import axios from "axios";
import react from "react";
import { useEffect, useState } from "react";

const ViewNotes = () => {

    const [notes, setNotes] = useState<any[]>([]);
    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = () => {
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
                    <div id="noteSet">
                        <p>{note.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default ViewNotes