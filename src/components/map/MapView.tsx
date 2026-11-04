import type { ReactNode } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "./leaflet";
import LocateButton from "./LocateButton";
import AutoResize from "./AutoResize";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
const TAIWAN_CENTER: [number, number] = [23.611, 120.768];

/**
 * 地圖外框：底圖 + 定位按鈕，內容 (marker、線) 由 children 決定。
 * 有設定 VITE_MAPBOX_TOKEN 用 Mapbox 底圖，否則用 OpenStreetMap (免金鑰)。
 */
export default function MapView({ children }: { children?: ReactNode }) {
  return (
    <MapContainer
      className="map"
      center={TAIWAN_CENTER}
      zoom={8}
      minZoom={7}
      maxZoom={19}
      zoomAnimation={false}
    >
      {MAPBOX_TOKEN ? (
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`}
          tileSize={512}
          zoomOffset={-1}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
        />
      ) : (
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      )}
      <AutoResize />
      {children}
      <LocateButton />
    </MapContainer>
  );
}
