import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "leaflet/dist/leaflet.css";
import "./index.css";
import { router } from "./router";
import { TdxError } from "./api/tdx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 只在 429 或網路錯誤時重試，其他錯誤 (401/404...) 重試也沒用
      retry: (failureCount, error) => {
        if (error instanceof TdxError && error.status !== 429) return false;
        return failureCount < 2;
      },
      // 429 時照伺服器的 Retry-After 等待，否則指數退避 (1s, 2s, 4s...)
      retryDelay: (attempt, error) =>
        error instanceof TdxError && error.retryAfter
          ? error.retryAfter * 1000
          : Math.min(1000 * 2 ** attempt, 10_000),
      refetchOnWindowFocus: false,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
