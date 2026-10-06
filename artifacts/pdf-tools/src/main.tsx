import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import { Analytics } from "@vercel/analytics/react";
import App from "./App.tsx";
import "./index.css";

import { setBaseUrl } from "@workspace/api-client-react";
import { resolvedApiBase } from "./lib/api-base";
console.log("Resolved API base:", resolvedApiBase);

setBaseUrl(resolvedApiBase);

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<App />
	</HelmetProvider>
);
