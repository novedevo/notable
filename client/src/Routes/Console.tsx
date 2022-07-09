import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export default function Console() {
	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 100 },
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
		{ id: 1, name: "userTest", username: "user", isAdmin: false },
		{ id: 2, name: "admin", username: "admin", isAdmin: true },
	]);

	const navigate = useNavigate();

	useEffect(() => {
		let mounted = true;
		getList().then((items) => {
			if (mounted) {
				setRows(items);
			}
		});
		return () => (mounted = false);
	}, []);

	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div style={{ flexGrow: 1 }}>
				<DataGrid autoHeight rows={rows} columns={columns} checkboxSelection />
			</div>
		</div>
	);
}

async function getList() {
	try {
		const result = await axios("/api/users", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("token")}`,
			},
		});
		return result.data.users;
	} catch (err) {
		console.log(err);
	}
}
