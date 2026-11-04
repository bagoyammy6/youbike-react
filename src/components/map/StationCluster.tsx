import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L, { icons } from "./leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import type { Availability, Station } from "../../api/types";
import { escapeHtml as e } from "../../lib/html";
import { formatTime } from "../../lib/format";

function stationPopupHtml(s: Station, a?: Availability): string {
  return `<div class="popup">
    <div class="popup__title">${e(s.StationName?.Zh_tw)}</div>
    <div class="popup__row"><i class="fa-solid fa-location-dot"></i>${e(s.StationAddress?.Zh_tw)}</div>
    <div class="popup__row"><i class="fa-solid fa-clock-rotate-left"></i>${e(formatTime(a?.UpdateTime ?? s.UpdateTime))}</div>
    <div class="popup__stats">
      <div class="stat"><div class="stat__label">可借單車</div><div class="stat__value">${e(a?.AvailableRentBikes ?? "-")}</div></div>
      <div class="stat"><div class="stat__label">可停空位</div><div class="stat__value">${e(a?.AvailableReturnBikes ?? "-")}</div></div>
    </div>
  </div>`;
}

interface Props {
  stations: Station[];
  availability: Map<string, Availability> | undefined;
}

/**
 * 站點可能有上千個，用 markercluster 把相近的點合併成一個數字圈。
 * react-leaflet 沒有內建 cluster，所以用 useMap 拿到地圖後「命令式」操作 Leaflet。
 */
export default function StationCluster({ stations, availability }: Props) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);

  // 建立 / 移除 cluster 圖層 (只做一次)
  useEffect(() => {
    const group = L.markerClusterGroup({ showCoverageOnHover: false, chunkedLoading: true });
    map.addLayer(group);
    groupRef.current = group;
    return () => {
      map.removeLayer(group);
      groupRef.current = null;
    };
  }, [map]);

  // 資料改變時重畫 marker
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clearLayers();
    const markers = stations
      .filter((s) => s.StationPosition?.PositionLat)
      .map((s) =>
        L.marker([s.StationPosition.PositionLat, s.StationPosition.PositionLon], {
          icon: icons.station,
          title: s.StationName?.Zh_tw,
        }).bindPopup(stationPopupHtml(s, availability?.get(s.StationUID)), {
          className: "popup-wrap",
          closeButton: false,
        }),
      );
    // 一次加入比一筆一筆加快很多
    group.addLayers(markers);
  }, [stations, availability]);

  return null;
}
