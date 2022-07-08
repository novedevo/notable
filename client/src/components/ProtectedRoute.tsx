import { Route, BrowserRouter, Routes, useNavigate } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";

export default function ProtectedRoute({
	component,
	...args
}: React.PropsWithChildren<any>) {
	const Component = withAuthenticationRequired(component, args);
	return <Component />;
}
