import { useMemo, useState } from "react";
import { useCyclingShapes, useNearbyPlaces, type NearbyArgs } from "../api/hooks";
import type { CyclingShape, Place } from "../api/types";
import ErrorMessage from "../components/ErrorMessage";
import ExplorerLayout from "../components/ExplorerLayout";
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import SearchForm from "../components/SearchForm";
import MapFocus from "../components/map/MapFocus";
import MapView from "../components/map/MapView";
import PlaceCard from "../features/road/PlaceCard";
import PlaceDetail from "../features/road/PlaceDetail";
import RoadCard from "../features/road/RoadCard";
import RoadFilter from "../features/road/RoadFilter";
import RoadLayers, { type RoadWithLines } from "../features/road/RoadLayers";
import { useSearchParamsState } from "../hooks/useSearchParamsState";
import { ROAD_CITIES } from "../lib/counties";
import { boundsCenter, parseWktLines } from "../lib/geometry";
import {
  ROAD_FILTERS,
  clampPage,
  isRoadFilterKey,
  matchKeyword,
  paginate,
  totalPages,
} from "../lib/list";

/** 左側面板目前顯示什麼 */
type View = { kind: "list" } | { kind: "nearby" } | { kind: "detail"; place: Place };

export default function FindRoadPage() {
  const { city: rawCity, keyword, page, filter: rawFilter, update } = useSearchParamsState();
  const city = rawCity && rawCity in ROAD_CITIES ? rawCity : null;
  const filter = isRoadFilterKey(rawFilter) ? rawFilter : null;

  const roadsQuery = useCyclingShapes(city);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [view, setView] = useState<View>({ kind: "list" });
  const [focusPlace, setFocusPlace] = useState<Place | null>(null);

  // 先把每條車道的 WKT 解析好 (只在資料改變時做一次)，解析失敗的車道略過
  const allRoads = useMemo<RoadWithLines[]>(
    () =>
      (roadsQuery.data ?? [])
        .map((road, i) => ({ key: `${i}-${road.RouteName}`, road, lines: parseWktLines(road.Geometry) }))
        .filter((r) => r.lines.length > 0),
    [roadsQuery.data],
  );

  const filtered = useMemo(
    () =>
      allRoads.filter(
        ({ road }) =>
          matchKeyword(road.RouteName, keyword) && (!filter || ROAD_FILTERS[filter].test(road)),
      ),
    [allRoads, keyword, filter],
  );
  const current = clampPage(page, filtered.length);
  const items = paginate(filtered, current);
  const pageKeys = useMemo(() => new Set(items.map((r) => r.key)), [items]);
  const selected = filtered.find((r) => r.key === selectedKey) ?? null;

  // 附近景點/餐廳：搜尋半徑 = 車道長度的 1/3，至少 500 公尺
  const nearbyArgs = useMemo<NearbyArgs | null>(() => {
    if (!selected || !city) return null;
    const center = boundsCenter(selected.lines);
    if (!center) return null;
    return {
      city,
      lat: center[0],
      lng: center[1],
      radius: Math.max(500, Math.round(selected.road.CyclingLength / 3)),
    };
  }, [selected, city]);
  const nearbyQuery = useNearbyPlaces(nearbyArgs);
  const places = nearbyQuery.data ?? [];

  const bounds = useMemo(
    () => (selected ? selected.lines.flat() : filtered.flatMap((r) => r.lines.flat())),
    [selected, filtered],
  );
  const point = useMemo(
    () => (focusPlace ? { position: focusPlace.position, zoom: 18 } : null),
    [focusPlace],
  );

  function selectRoad(key: string) {
    setSelectedKey(key);
    setFocusPlace(null);
  }

  function showNearby(road: CyclingShape) {
    const match = filtered.find((r) => r.road === road);
    if (match) selectRoad(match.key);
    setView({ kind: "nearby" });
  }

  let panelBody;
  if (view.kind === "detail") {
    panelBody = (
      <>
        <BackButton onClick={() => setView({ kind: "nearby" })} />
        <PlaceDetail place={view.place} />
      </>
    );
  } else if (view.kind === "nearby" && selected) {
    panelBody = (
      <>
        <BackButton
          onClick={() => {
            setView({ kind: "list" });
            setFocusPlace(null);
          }}
        />
        <h2 className="panel__subtitle">{selected.road.RouteName} 附近</h2>
        {nearbyQuery.isLoading && <Loading />}
        {nearbyQuery.isError && (
          <ErrorMessage error={nearbyQuery.error} onRetry={() => nearbyQuery.refetch()} />
        )}
        {nearbyQuery.isSuccess && places.length === 0 && <p className="message">附近沒有景點或餐廳</p>}
        <ul className="card-list">
          {places.map((p) => (
            <PlaceCard
              key={p.id}
              place={p}
              active={focusPlace?.id === p.id}
              onSelect={setFocusPlace}
              onDetail={(place) => {
                setFocusPlace(place);
                setView({ kind: "detail", place });
              }}
            />
          ))}
        </ul>
      </>
    );
  } else {
    panelBody = (
      <>
        <SearchForm
          key={`${city}|${keyword}`}
          cities={ROAD_CITIES}
          city={city}
          keyword={keyword}
          placeholder="請輸入車道名稱"
          onSearch={(c, q) => {
            setSelectedKey(null);
            setFocusPlace(null);
            update({ city: c, q, page: 1, filter: null });
          }}
        />
        <hr className="divider" />
        {city && (
          <RoadFilter
            value={filter}
            onChange={(f) => {
              setSelectedKey(null);
              update({ filter: f, page: 1 });
            }}
          />
        )}
        {!city && <p className="message">請選擇縣市後按下搜尋</p>}
        {roadsQuery.isLoading && <Loading />}
        {roadsQuery.isError && (
          <ErrorMessage error={roadsQuery.error} onRetry={() => roadsQuery.refetch()} />
        )}
        {roadsQuery.isSuccess && filtered.length === 0 && <p className="message">查無資料</p>}
        {filtered.length > 0 && (
          <>
            <p className="panel__count">共 {filtered.length} 條車道</p>
            <ul className="card-list">
              {items.map((r) => (
                <RoadCard
                  key={r.key}
                  road={r.road}
                  keyword={keyword}
                  active={r.key === selectedKey}
                  onSelect={() => selectRoad(r.key)}
                  onShowNearby={showNearby}
                />
              ))}
            </ul>
          </>
        )}
      </>
    );
  }

  return (
    <ExplorerLayout
      panel={
        <>
          <h1 className="panel__title">尋找車道</h1>
          {panelBody}
        </>
      }
      footer={
        view.kind === "list" &&
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
          <RoadLayers
            roads={filtered}
            startMarkerKeys={selected ? new Set([...pageKeys, selected.key]) : pageKeys}
            selectedKey={selectedKey}
            places={selected ? places : []}
            onSelectRoad={selectRoad}
          />
          <MapFocus bounds={bounds} point={point} />
        </MapView>
      }
    />
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="btn btn--ghost back" onClick={onClick}>
      <i className="fa-solid fa-angle-left" aria-hidden /> 返回
    </button>
  );
}
