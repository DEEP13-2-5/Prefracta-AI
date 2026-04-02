import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./lib/auth-context";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

createRoot(document.getElementById("root")!).render(
    <AppErrorBoundary>
        <AuthProvider>
            <App />
        </AuthProvider>
    </AppErrorBoundary>
);
