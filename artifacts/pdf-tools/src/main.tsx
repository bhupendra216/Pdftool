import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";

import App from "./App";
import "./index.css";

// Point the generated API client to your Railway backend
setBaseUrl(import.meta.env.VITE_API_BASE_URL || null);

createRoot(document.getElementById("root")!).render(<App />);
