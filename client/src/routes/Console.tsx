import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardButton from "../components/DashboardButton";


// import { useNavigate } from "react-router-dom";
export default function Console() {
	const username = JSON.parse(localStorage.getItem("user")!).username;
	const columns: GridColDef[] = [
		{ field: "id", headerName: "ID", width: 100 },
		{ field: "name", headerName: "Name", width: 100, editable: true },
		{ field: "username", headerName: "Username", width: 100 },
		{
			field: "admin",
			headerName: "Is Admin",
			width: 100,
			editable: true,
			type: "boolean",
		},
	];

	const [rows, setRows] = useState([
		{ id: 1, name: "userTest", username: "user", admin: false },
		{ id: 2, name: "admin", username: "admin", admin: true },
	]);

	// const navigate = useNavigate();

	useEffect(() => {
		getList().then((items) => {
			setRows(items);
		});
	}, []);

	return (
		<div style={{ display: "flex", height: "100%" }}>
			<div style={{ flexGrow: 1 }}>
				<DataGrid
					autoHeight
					rows={rows}
					columns={columns}
					checkboxSelection
					disableSelectionOnClick
					experimentalFeatures={{ newEditingApi: true }}
					processRowUpdate={async (newRow, oldRow) => {
						if (newRow.username === username && !newRow.admin) {
							alert("You cannot remove your own admin status");
							return oldRow;
						}
						await axios.put(
							`/api/update_user?username=${newRow.username}`,
							newRow,
							{
								headers: {
									Authorization: `Bearer ${localStorage.getItem("token")}`,
								},
							}
						);
						return newRow;
					}}
				/>
			</div>
		</div>
		<Container>
			<DashboardButton />
		</Container>
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
