import { useState } from "react";
import { Marker, Popup, useMap } from "react-leaflet";
import { icons } from "./leaflet";

/** 右下角的「目前位置」按鈕 */
export default function LocateButton() {
  const map = useMap();
  const [me, setMe] = useState<[number, number] | null>(null);
  const [busy, setBusy] = useState(false);

  function locate() {
    if (!navigator.geolocation) {
      alert("此瀏覽器不支援定位");
      return;
    }
    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setBusy(false);
        const pos: [number, number] = [coords.latitude, coords.longitude];
        setMe(pos);
        map.flyTo(pos, 17);
      },
      (err) => {
        setBusy(false);
        alert(err.code === err.PERMISSION_DENIED ? "請允許瀏覽器存取位置" : "無法取得目前位置");
      },
      { timeout: 10_000 },
    );
  }

  return (
    <>
      <div className="leaflet-bottom leaflet-right">
        <button
          type="button"
          className="leaflet-control locate-btn"
          onClick={locate}
          disabled={busy}
          aria-label="移動到目前位置"
          title="目前位置"
        >
          <i
            className={busy ? "fa-solid fa-spinner fa-spin" : "fa-solid fa-location-crosshairs"}
            aria-hidden
          />
        </button>
      </div>
      {me && (
        <Marker position={me} icon={icons.me}>
          <Popup>目前位置</Popup>
        </Marker>
      )}
    </>
  );
}
