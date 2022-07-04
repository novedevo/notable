const table = document.querySelector("tbody");

async function regenTable() {
	table.replaceChildren();
	const users = await fetch("/api/users").then((res) => res.json());
	for (const user of users) {
		console.log(user);
		const tr = document.createElement("tr");

		const cols = [1, 2, 3, 4, 5].map(() => document.createElement("td"));

		cols[0].textContent = user.name;
		cols[1].textContent = user.username;
		cols[2].textContent = user.admin ? "admin" : "user";

		const moteButton = document.createElement("button");
		moteButton.classList.add("btn", "btn-primary");
		moteButton.textContent = user.admin ? "Demote to User" : "Promote to Admin";
		moteButton.addEventListener("click", async () => {
			const res = await fetch(
				`/api/${user.admin ? "demote" : "promote"}_user?username=${
					user.username
				}`,
				{
					method: "PATCH",
				}
			);
			if (res.ok) {
				await regenTable();
			} else {
				alert("Error editing user");
			}
		});

		const deleteButton = document.createElement("button");
		deleteButton.classList.add("btn", "btn-danger");
		deleteButton.textContent = "Delete";
		deleteButton.addEventListener("click", async () => {
			const res = await fetch(`/api/delete_user?username=${user.username}`, {
				method: "DELETE",
			});
			if (res.ok) {
				tr.remove();
			} else {
				alert("Error deleting user");
			}
		});
		cols[4].appendChild(deleteButton);

		cols[3].appendChild(moteButton);

		tr.replaceChildren(...cols);

		table.appendChild(tr);
	}
}

await regenTable();
