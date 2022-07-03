const data = await fetch("/api/user_info").then((res) => res.json());
document.getElementById("name").textContent = data.name;
if (!data.admin) {
	document.getElementById("admin").remove;
} else {
	document.getElementById("admin").style.display = "block";
}
