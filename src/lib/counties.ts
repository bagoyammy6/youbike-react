/** TDX 城市代碼 -> 中文名稱 */

// 有公共自行車資料的縣市
export const BIKE_CITIES = {
  Taipei: "臺北市",
  NewTaipei: "新北市",
  Taoyuan: "桃園市",
  Hsinchu: "新竹市",
  MiaoliCounty: "苗栗縣",
  Taichung: "臺中市",
  Chiayi: "嘉義市",
  Tainan: "臺南市",
  Kaohsiung: "高雄市",
  PingtungCounty: "屏東縣",
  KinmenCounty: "金門縣",
} as const satisfies Record<string, string>;

// 有自行車道資料的縣市
export const ROAD_CITIES = {
  Keelung: "基隆市",
  Taipei: "臺北市",
  NewTaipei: "新北市",
  Taoyuan: "桃園市",
  HsinchuCounty: "新竹縣",
  MiaoliCounty: "苗栗縣",
  Taichung: "臺中市",
  NantouCounty: "南投縣",
  ChanghuaCounty: "彰化縣",
  YunlinCounty: "雲林縣",
  ChiayiCounty: "嘉義縣",
  Chiayi: "嘉義市",
  Tainan: "臺南市",
  Kaohsiung: "高雄市",
  YilanCounty: "宜蘭縣",
  HualienCounty: "花蓮縣",
  TaitungCounty: "臺東縣",
  PingtungCounty: "屏東縣",
  KinmenCounty: "金門縣",
  PenghuCounty: "澎湖縣",
} as const satisfies Record<string, string>;

export type CityMap = Record<string, string>;
