/**
 * 解析 TDX 車道的 WKT 字串。
 * 只需要支援 LINESTRING 與 MULTILINESTRING，所以自己寫，不另外裝套件。
 *
 * WKT 座標順序是「經度 緯度」，Leaflet 要的是 [緯度, 經度]，這裡會轉好。
 */
export type LatLng = [number, number];

function parseCoords(text: string): LatLng[] {
  return text
    .split(",")
    .map((pair) => pair.trim().split(/\s+/).map(Number))
    .filter((nums) => nums.length >= 2 && nums.every(Number.isFinite))
    .map(([lng, lat]) => [lat, lng] as LatLng);
}

/** 回傳多條線段，每條是 [lat, lng] 陣列。格式不認得時回傳 [] */
export function parseWktLines(wkt: string | undefined | null): LatLng[][] {
  if (!wkt) return [];
  const text = wkt.trim();
  const upper = text.toUpperCase();
  const body = text.slice(text.indexOf("(") + 1, text.lastIndexOf(")"));

  if (upper.startsWith("MULTILINESTRING")) {
    // 取出每一組 ( ... )
    const parts = body.match(/\(([^()]*)\)/g) ?? [];
    return parts
      .map((p) => parseCoords(p.slice(1, -1)))
      .filter((line) => line.length > 0);
  }
  if (upper.startsWith("LINESTRING")) {
    const line = parseCoords(body);
    return line.length > 0 ? [line] : [];
  }
  return [];
}

/** 所有點的外框中心 */
export function boundsCenter(lines: LatLng[][]): LatLng | null {
  const pts = lines.flat();
  if (pts.length === 0) return null;
  const lats = pts.map((p) => p[0]);
  const lngs = pts.map((p) => p[1]);
  return [
    (Math.min(...lats) + Math.max(...lats)) / 2,
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
  ];
}
