import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "./leaflet";

type LatLng = [number, number];

interface Props {
  /** 這組點改變時，把地圖縮放到剛好包住它們 (例如：新的搜尋結果) */
  bounds?: LatLng[] | null;
  /** 這個點改變時飛過去 (例如：點了某張卡片) */
  point?: { position: LatLng; zoom?: number } | null;
}

/**
 * 移動地圖的「隱形元件」。
 * 兩種移動分開處理：取消選取 (point 變成 null) 時不會把地圖拉回全縣市。
 */
export default function MapFocus({ bounds, point }: Props) {
  const map = useMap();

  useEffect(() => {
    if (!bounds || bounds.length === 0) return;
    const b = L.latLngBounds(bounds);
    if (b.isValid()) map.fitBounds(b, { padding: [40, 40] });
  }, [map, bounds]);

  useEffect(() => {
    if (point) map.flyTo(point.position, point.zoom ?? 18);
  }, [map, point]);

  return null;
}
