/**
 * leaflet.markercluster 是舊式套件，會去找全域的 window.L，
 * 所以要先把 Leaflet 掛到 window 上，再載入 markercluster。
 * (ES module 會依照 import 的順序執行，所以在別的檔案先 import 這支就好)
 */
import L from "leaflet";

declare global {
  interface Window {
    L: typeof L;
  }
}
window.L = L;

const base = import.meta.env.BASE_URL;
const ICON_SIZE: L.PointExpression = [45, 55];
const ICON_ANCHOR: L.PointExpression = [22, 55];
const POPUP_ANCHOR: L.PointExpression = [0, -50];

function makeIcon(file: string) {
  return L.icon({
    iconUrl: `${base}${file}`,
    iconSize: ICON_SIZE,
    iconAnchor: ICON_ANCHOR,
    popupAnchor: POPUP_ANCHOR,
  });
}

// 同一種圖示只建立一次，所有 marker 共用
export const icons = {
  station: makeIcon("L.svg"),
  start: makeIcon("start.svg"),
  view: makeIcon("view.svg"),
  food: makeIcon("eat.svg"),
  me: makeIcon("location.svg"),
};

export default L;
