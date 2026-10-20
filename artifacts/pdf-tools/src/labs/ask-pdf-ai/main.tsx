import { createRoot } from "react-dom/client";
import { AskPdfAiLab } from "./AskPdfAiLab";
import "../../index.css";
import { Router } from "wouter";

createRoot(document.getElementById("root")!).render(
  <Router>
    <AskPdfAiLab />
  </Router>,
);
