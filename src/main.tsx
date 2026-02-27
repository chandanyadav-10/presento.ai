import { Children, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Workspace from "./workspace/index.tsx";
import Project from "./workspace/project/index.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  {
    path: "/workspace",
    element: <Workspace />,
    children: [{ path: "project/:projectId", element: <Project /> }],
  },
]);

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
);
