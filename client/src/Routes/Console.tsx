import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Console() {
	const columns: GridColDef[] = [
		{ field: "name", headerName: "Name", width: 100, editable: true },
		{ field: "username", headerName: "Username", width: 100 },
		{
			field: "isAdmin",
			headerName: "Is Admin",
			width: 100,
			editable: true,
			type: "boolean",
		},
	];

	const [rows, setRows] = useState([
		{ name: "user", username: "user", isAdmin: false },
		{ name: "admin", username: "admin", isAdmin: true },
	]);

	const navigate = useNavigate();

	axios("/api/users").then((res) => {
		if (res.data.users) {
			setRows(res.data.users);
		} else {
			navigate("/login");
		}
	});

	return <DataGrid rows={rows} columns={columns} checkboxSelection />;
}
