import React from "react";
import ReactDOM from "react-dom/client";

import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
		<Auth0Provider
			domain="dev--9y96m38.us.auth0.com"
			clientId="hGI1Yfwl4sxFw2gNy2M1For7p6gc78ji"
			redirectUri={window.location.origin}
			audience="https://dev--9y96m38.us.auth0.com/api/v2"
			scope="read:current_user update:current_user_metadata"
		>
			<App />
		</Auth0Provider>
	</React.StrictMode>
);
