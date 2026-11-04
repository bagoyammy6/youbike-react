// TDX 回傳資料的型別 (只列出畫面有用到的欄位)

export interface LocalizedName {
  Zh_tw: string;
  En?: string;
}

export interface Position {
  PositionLat: number;
  PositionLon: number;
}

export interface Station {
  StationUID: string;
  StationName: LocalizedName;
  StationAddress: LocalizedName;
  StationPosition: Position;
  UpdateTime: string;
}

/** 0 停止營運 / 1 正常營運 / 2 暫停營運 */
export type ServiceStatus = 0 | 1 | 2;

export interface Availability {
  StationUID: string;
  ServiceStatus: ServiceStatus;
  AvailableRentBikes: number;
  AvailableReturnBikes: number;
  UpdateTime: string;
}

export interface CyclingShape {
  RouteName: string;
  City: string;
  Town?: string;
  Direction?: string;
  CyclingLength: number;
  RoadSectionStart?: string;
  RoadSectionEnd?: string;
  /** WKT 格式，例如 MULTILINESTRING((121.5 25.0, ...)) */
  Geometry: string;
}

export interface Picture {
  PictureUrl1?: string;
  PictureDescription1?: string;
}

interface PlaceBase {
  Address?: string;
  Phone?: string;
  OpenTime?: string;
  Picture?: Picture;
  Position: Position;
  City?: string;
}

export interface ScenicSpot extends PlaceBase {
  ScenicSpotID: string;
  ScenicSpotName: string;
  DescriptionDetail?: string;
}

export interface Restaurant extends PlaceBase {
  RestaurantID: string;
  RestaurantName: string;
  Description?: string;
}

/** 把景點與餐廳整理成同一種形狀，方便列表與詳細頁共用 */
export interface Place {
  id: string;
  kind: "view" | "food";
  name: string;
  address?: string;
  phone?: string;
  openTime?: string;
  description?: string;
  picture?: string;
  pictureAlt?: string;
  city?: string;
  position: [number, number];
}
