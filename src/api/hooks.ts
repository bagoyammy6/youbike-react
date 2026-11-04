/**
 * 資料查詢 hooks (TanStack Query)。
 *
 * TanStack Query 幫我們做好了：
 * - 快取：同一個縣市在 staleTime 內不會重打 API
 * - 合併：多個元件同時要同一份資料，只會送出一個請求
 * - 重試：只在 429 / 網路錯誤時重試，並依 Retry-After 等待
 */
import { useQuery } from "@tanstack/react-query";
import { tdxGet } from "./tdx";
import type {
  Availability,
  CyclingShape,
  Place,
  Restaurant,
  ScenicSpot,
  Station,
} from "./types";

const MIN = 60 * 1000;

// $select 只拿畫面需要的欄位，回應體積小很多
const STATION_FIELDS = "StationUID,StationName,StationAddress,StationPosition,UpdateTime";
const AVAILABILITY_FIELDS =
  "StationUID,ServiceStatus,AvailableRentBikes,AvailableReturnBikes,UpdateTime";
const SCENIC_FIELDS =
  "ScenicSpotID,ScenicSpotName,Address,Phone,OpenTime,DescriptionDetail,Picture,Position,City";
const RESTAURANT_FIELDS =
  "RestaurantID,RestaurantName,Address,Phone,OpenTime,Description,Picture,Position,City";

export function useStations(city: string | null) {
  return useQuery({
    queryKey: ["stations", city],
    queryFn: ({ signal }) =>
      tdxGet<Station[]>(
        `/api/basic/v2/Bike/Station/City/${city}`,
        { $select: STATION_FIELDS },
        signal,
      ),
    enabled: !!city,
    staleTime: 30 * MIN,
  });
}

export function useAvailability(city: string | null) {
  return useQuery({
    queryKey: ["availability", city],
    queryFn: ({ signal }) =>
      tdxGet<Availability[]>(
        `/api/basic/v2/Bike/Availability/City/${city}`,
        { $select: AVAILABILITY_FIELDS },
        signal,
      ),
    enabled: !!city,
    staleTime: 1 * MIN,
    // 畫面開著時每分鐘自動更新一次即時車輛數 (切到背景分頁會自動暫停)
    refetchInterval: 1 * MIN,
    // 轉成 UID -> 資料 的 Map，用 StationUID 對應站點
    select: (list) => new Map(list.map((a) => [a.StationUID, a])),
  });
}

export function useCyclingShapes(city: string | null) {
  return useQuery({
    queryKey: ["cycling", city],
    queryFn: ({ signal }) =>
      tdxGet<CyclingShape[]>(`/api/basic/v2/Cycling/Shape/City/${city}`, {}, signal),
    enabled: !!city,
    staleTime: 60 * MIN,
  });
}

function toPlaceFromScenic(d: ScenicSpot): Place {
  return {
    id: `view-${d.ScenicSpotID}`,
    kind: "view",
    name: d.ScenicSpotName,
    address: d.Address,
    phone: d.Phone,
    openTime: d.OpenTime,
    description: d.DescriptionDetail,
    picture: d.Picture?.PictureUrl1,
    pictureAlt: d.Picture?.PictureDescription1,
    city: d.City,
    position: [d.Position.PositionLat, d.Position.PositionLon],
  };
}

function toPlaceFromRestaurant(d: Restaurant): Place {
  return {
    id: `food-${d.RestaurantID}`,
    kind: "food",
    name: d.RestaurantName,
    address: d.Address,
    phone: d.Phone,
    openTime: d.OpenTime,
    description: d.Description,
    picture: d.Picture?.PictureUrl1,
    pictureAlt: d.Picture?.PictureDescription1,
    city: d.City,
    position: [d.Position.PositionLat, d.Position.PositionLon],
  };
}

export interface NearbyArgs {
  city: string;
  lat: number;
  lng: number;
  radius: number;
}

/** 車道附近的景點 + 餐廳 */
export function useNearbyPlaces(args: NearbyArgs | null) {
  return useQuery({
    queryKey: ["nearby", args],
    queryFn: async ({ signal }) => {
      const { city, lat, lng, radius } = args!;
      const spatial = `nearby(${lat.toFixed(5)},${lng.toFixed(5)},${radius})`;
      const [views, foods] = await Promise.all([
        tdxGet<ScenicSpot[]>(
          `/api/basic/v2/Tourism/ScenicSpot/${city}`,
          { $select: SCENIC_FIELDS, $spatialFilter: spatial },
          signal,
        ),
        tdxGet<Restaurant[]>(
          `/api/basic/v2/Tourism/Restaurant/${city}`,
          { $select: RESTAURANT_FIELDS, $spatialFilter: spatial },
          signal,
        ),
      ]);
      return [
        ...views.filter((d) => d.Position?.PositionLat).map(toPlaceFromScenic),
        ...foods.filter((d) => d.Position?.PositionLat).map(toPlaceFromRestaurant),
      ];
    },
    enabled: !!args,
    staleTime: 60 * MIN,
  });
}
