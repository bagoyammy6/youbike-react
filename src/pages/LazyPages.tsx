import { lazy, Suspense } from "react";
import Loading from "../components/Loading";

// 地圖頁比較大 (含 Leaflet)，用 lazy 拆成獨立的檔案，首頁會載入得比較快
const FindBikePage = lazy(() => import("./FindBikePage"));
const FindRoadPage = lazy(() => import("./FindRoadPage"));

export function LazyFindBikePage() {
  return (
    <Suspense fallback={<Loading />}>
      <FindBikePage />
    </Suspense>
  );
}

export function LazyFindRoadPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FindRoadPage />
    </Suspense>
  );
}
