const table = document.querySelector("tbody");

async function regenTable() {
	table.replaceChildren([]);
	const users = await fetch("/api/users").then((res) => res.json());
	for (const user of users) {
		const tr = document.createElement("tr");

		const cols = [1, 2, 3, 4, 5].map(() => document.createElement("td"));

		cols[0].textContent = user.username;
		cols[1].textContent = user.name;
		cols[2].textContent = user.admin;

		const moteButton = document.createElement("button");
		moteButton.classList.add("btn", "btn-primary");
		moteButton.textContent = user.admin ? "Promote to Admin" : "Demote to User";
		moteButton.addEventListener("click", async () => {
			await fetch(
				`/api/${user.admin ? "promote" : "demote"}_user?username=${
					user.username
				}`,
				{
					method: "PATCH",
				}
			);
			await regenTable();
		});

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("btn", "btn-danger");
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", async () => {
			await fetch(`/api/delete_user?username=${user.username}`, {
				method: "DELETE",
			});
			tr.remove();
		});
		cols[4].appendChild(deleteButton);

		cols[3].appendChild(moteButton);

		tr.replaceChildren(cols);

		table.appendChild(tr);
	}
}
