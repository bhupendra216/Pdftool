import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";
import "./index.css";

import { setBaseUrl } from "@workspace/api-client-react";

const resolvedApiBase = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:3000" : "");
console.log("Resolved API base:", resolvedApiBase);

setBaseUrl(resolvedApiBase);

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<App />
	</HelmetProvider>
);
