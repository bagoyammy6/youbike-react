import { Fragment } from "react";
import { Marker, Polyline, Popup } from "react-leaflet";
import type { CyclingShape, Place } from "../../api/types";
import type { LatLng } from "../../lib/geometry";
import { formatLength } from "../../lib/format";
import { icons } from "../../components/map/leaflet";

export interface RoadWithLines {
  key: string;
  road: CyclingShape;
  lines: LatLng[][];
}

interface Props {
  roads: RoadWithLines[];
  /** 只在這些車道畫起點 marker (目前頁面的 6 筆)，避免 marker 太多 */
  startMarkerKeys: Set<string>;
  selectedKey: string | null;
  places: Place[];
  onSelectRoad: (key: string) => void;
}

const LINE = { color: "#C50047", weight: 4, opacity: 0.6 };
const LINE_ACTIVE = { color: "#C50047", weight: 7, opacity: 0.95 };

/** 車道線、起點、附近景點/餐廳。popup 用 JSX，React 會自動跳脫內容 */
export default function RoadLayers({
  roads,
  startMarkerKeys,
  selectedKey,
  places,
  onSelectRoad,
}: Props) {
  return (
    <>
      {roads.map(({ key, road, lines }) => (
        <Fragment key={key}>
          <Polyline
            positions={lines}
            pathOptions={key === selectedKey ? LINE_ACTIVE : LINE}
            eventHandlers={{ click: () => onSelectRoad(key) }}
          />
          {startMarkerKeys.has(key) && lines[0]?.[0] && (
            <Marker position={lines[0][0]} icon={icons.start}>
              <Popup className="popup-wrap" closeButton={false}>
                <div className="popup">
                  <div className="popup__title">{road.RouteName}</div>
                  <div className="popup__row">
                    <i className="fa-solid fa-location-dot" />
                    {road.City} {road.Town}
                  </div>
                  <div className="popup__row">
                    <i className="fa-solid fa-route" />
                    {road.Direction} · {formatLength(road.CyclingLength)}
                  </div>
                  <div className="popup__row">
                    <b>開始</b> {road.RoadSectionStart}
                  </div>
                  <div className="popup__row">
                    <b>結束</b> {road.RoadSectionEnd}
                  </div>
                </div>
              </Popup>
            </Marker>
          )}
        </Fragment>
      ))}
      {places.map((p) => (
        <Marker key={p.id} position={p.position} icon={p.kind === "view" ? icons.view : icons.food}>
          <Popup className="popup-wrap" closeButton={false}>
            <div className="popup">
              <div className="popup__title">{p.name}</div>
              {p.address && (
                <div className="popup__row">
                  <i className="fa-solid fa-location-dot" />
                  {p.address}
                </div>
              )}
              {p.phone && (
                <div className="popup__row">
                  <i className="fa-solid fa-phone" />
                  {p.phone}
                </div>
              )}
              {p.openTime && (
                <div className="popup__row">
                  <i className="fa-regular fa-calendar" />
                  {p.openTime}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
