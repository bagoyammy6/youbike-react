import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * 地圖容器大小改變時 (例如手機版從「列表」切到「地圖」)，
 * Leaflet 不會自己發現，要呼叫 invalidateSize() 重新計算，否則地圖會變灰一塊。
 */
export default function AutoResize() {
  const map = useMap();
  useEffect(() => {
    const el = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(el);
    return () => observer.disconnect();
  }, [map]);
  return null;
}
