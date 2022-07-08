import "./App.css";
import LoginButton from "./components/LoginButton";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./components/LogoutButton";

function App() {
	const { isAuthenticated, isLoading } = useAuth0();
	if (isLoading) {
		return <>Loading ...</>;
	}
	return isAuthenticated ? <LogoutButton /> : <LoginButton />;
}

export default App;
