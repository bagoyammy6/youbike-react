import { createHashRouter } from "react-router";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import { LazyFindBikePage, LazyFindRoadPage } from "./pages/LazyPages";

// GitHub Pages 沒有 SPA fallback，用 hash 路由 (/#/findbike) 重新整理才不會 404
export const router = createHashRouter([
  { path: "/", element: <HomePage /> },
  { path: "/findbike", element: <LazyFindBikePage /> },
  { path: "/findroad", element: <LazyFindRoadPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
