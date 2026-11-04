import { useState, type ReactNode } from "react";
import NavBar from "./NavBar";

interface Props {
  panel: ReactNode;
  footer?: ReactNode;
  map: ReactNode;
}

/**
 * 單車頁 / 車道頁共用的版面：左邊列表、右邊地圖。
 * 手機版一次只顯示一邊，用下方按鈕切換。
 */
export default function ExplorerLayout({ panel, footer, map }: Props) {
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  return (
    <div className="app">
      <NavBar />
      <main className={`explorer explorer--${mobileView}`}>
        <aside className="panel">
          <div className="panel__scroll">{panel}</div>
          {footer && <div className="panel__footer">{footer}</div>}
        </aside>
        <section className="explorer__map" aria-label="地圖">
          {map}
        </section>
        <button
          type="button"
          className="btn btn--primary explorer__toggle"
          onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
        >
          {mobileView === "list" ? "顯示地圖" : "顯示列表"}
        </button>
      </main>
    </div>
  );
}
