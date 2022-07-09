import "./App.css";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";

function App() {
	const isAuthenticated = true;
	return isAuthenticated ? <LogoutButton /> : <LoginButton />;
}

export default App;
