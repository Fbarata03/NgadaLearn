import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { Lessons } from "./components/Lessons";
import { Subscribe } from "./components/Subscribe";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "dashboard", Component: Dashboard },
      { path: "lessons", Component: Lessons },
      { path: "subscribe", Component: Subscribe },
    ],
  },
]);
