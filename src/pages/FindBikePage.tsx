import { useMemo, useState } from "react";
import { Popup } from "react-leaflet";
import { useAvailability, useStations } from "../api/hooks";
import type { Station } from "../api/types";
import ErrorMessage from "../components/ErrorMessage";
import ExplorerLayout from "../components/ExplorerLayout";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import MapFocus from "../components/map/MapFocus";
import MapView from "../components/map/MapView";
import StationCluster from "../components/map/StationCluster";
import BikeCard from "../features/bike/BikeCard";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { BIKE_CITIES } from "../lib/counties";
import { formatTime } from "../lib/format";
import { clampPage, matchKeyword, paginate, totalPages } from "../lib/list";

export default function FindBikePage() {
  const { city: rawCity, keyword, page, update } = useSearchParamsState();
  const city = rawCity && rawCity in BIKE_CITIES ? rawCity : null;

  const stationsQuery = useStations(city);
  const availabilityQuery = useAvailability(city);
  const availability = availabilityQuery.data;

  const [selected, setSelected] = useState<Station | null>(null);

  // 關鍵字篩選與分頁都在前端做，換頁不會發送任何請求
  const filtered = useMemo(
    () => (stationsQuery.data ?? []).filter((s) => matchKeyword(s.StationName?.Zh_tw, keyword)),
    [stationsQuery.data, keyword],
  );
  const current = clampPage(page, filtered.length);
  const items = paginate(filtered, current);

  const bounds = useMemo(
    () =>
      filtered.map(
        (s) => [s.StationPosition.PositionLat, s.StationPosition.PositionLon] as [number, number],
      ),
    [filtered],
  );
  const point = useMemo(
    () =>
      selected
        ? {
            position: [
              selected.StationPosition.PositionLat,
              selected.StationPosition.PositionLon,
            ] as [number, number],
            zoom: 18,
          }
        : null,
    [selected],
  );

  const selectedAva = selected ? availability?.get(selected.StationUID) : undefined;

  const panel = (
    <>
      <h1 className="panel__title">尋找單車</h1>
      <SearchForm
        // 網址改變 (例如按上一頁) 時重設表單內容
        key={`${city}|${keyword}`}
        cities={BIKE_CITIES}
        city={city}
        keyword={keyword}
        placeholder="請輸入車站名稱"
        onSearch={(c, q) => {
          setSelected(null);
          update({ city: c, q, page: 1 });
        }}
      />
      <hr className="divider" />
      {!city && <p className="message">請選擇縣市後按下搜尋</p>}
      {stationsQuery.isLoading && <Loading />}
      {stationsQuery.isError && (
        <ErrorMessage error={stationsQuery.error} onRetry={() => stationsQuery.refetch()} />
      )}
      {availabilityQuery.isError && (
        <ErrorMessage error={availabilityQuery.error} onRetry={() => availabilityQuery.refetch()} />
      )}
      {stationsQuery.isSuccess && filtered.length === 0 && <p className="message">查無資料</p>}
      {stationsQuery.isSuccess && filtered.length > 0 && (
        <>
          <p className="panel__count">共 {filtered.length} 個站點</p>
          <ul className="card-list">
            {items.map((s) => (
              <BikeCard
                key={s.StationUID}
                station={s}
                availability={availability?.get(s.StationUID)}
                keyword={keyword}
                active={selected?.StationUID === s.StationUID}
                onSelect={setSelected}
              />
            ))}
          </ul>
        </>
      )}
    </>
  );

  return (
    <ExplorerLayout
      panel={panel}
      footer={
        filtered.length > 0 && (
          <Pagination
            page={current}
            total={totalPages(filtered.length)}
            onChange={(p) => update({ page: p })}
          />
        )
      }
      map={
        <MapView>
          <StationCluster stations={filtered} availability={availability} />
          <MapFocus bounds={bounds} point={point} />
          {selected && (
            <Popup
              position={[selected.StationPosition.PositionLat, selected.StationPosition.PositionLon]}
              className="popup-wrap"
              closeButton={false}
              eventHandlers={{ remove: () => setSelected(null) }}
            >
              <div className="popup">
                <div className="popup__title">{selected.StationName.Zh_tw}</div>
                <div className="popup__row">
                  <i className="fa-solid fa-location-dot" />
                  {selected.StationAddress?.Zh_tw}
                </div>
                <div className="popup__row">
                  <i className="fa-solid fa-clock-rotate-left" />
                  {formatTime(selectedAva?.UpdateTime ?? selected.UpdateTime)}
                </div>
                <div className="popup__stats">
                  <div className="stat">
                    <div className="stat__label">可借單車</div>
                    <div className="stat__value">{selectedAva?.AvailableRentBikes ?? "-"}</div>
                  </div>
                  <div className="stat">
                    <div className="stat__label">可停空位</div>
                    <div className="stat__value">{selectedAva?.AvailableReturnBikes ?? "-"}</div>
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </MapView>
      }
    />
  );
}
