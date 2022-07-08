import { DataGrid, GridColDef } from "@mui/x-data-grid";
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

	const rows = [
		//TODO: get from API
		{ name: "John", username: "johndoe", isAdmin: false },
		{ name: "Jane", username: "janedoe", isAdmin: true },
	];

	return <DataGrid rows={rows} columns={columns} checkboxSelection />;
}
