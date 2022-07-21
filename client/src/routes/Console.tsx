import { Button, Container } from "@mui/material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import DashboardButton from "../components/DashboardButton";

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

	useEffect(() => {
		getList().then((items) => {
			setRows(items);
		});
	}, []);

	const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([]);

	return (
		<>
			<Button
				onClick={async () => {
					for (const id of selectionModel) {
						if (rows.find((row) => row.id === id)!.admin) {
							alert("You cannot delete an admin without first demoting them");
							return;
						}
						axios
							.delete(`/api/user/${id}`, {
								headers: {
									Authorization: `Bearer ${localStorage.getItem("token")}`,
								},
							})
							.then(() => setRows(rows.filter((row) => row.id !== id)))
							.catch((err) => console.error(err));
					}
				}}
			>
				Delete selected users
			</Button>
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
						onSelectionModelChange={setSelectionModel}
						selectionModel={selectionModel}
					/>
				</div>
			</div>
			<Container>
				<DashboardButton />
			</Container>
		</>
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
