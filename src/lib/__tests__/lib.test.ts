import { describe, expect, it } from "vitest";
import { boundsCenter, parseWktLines } from "../geometry";
import { ROAD_FILTERS, clampPage, matchKeyword, paginate, totalPages } from "../list";
import { escapeHtml } from "../html";
import { formatLength } from "../format";
import type { CyclingShape } from "../../api/types";

describe("parseWktLines", () => {
  it("解析 LINESTRING，並把 經度 緯度 轉成 [緯度, 經度]", () => {
    expect(parseWktLines("LINESTRING(121.5 25.0, 121.6 25.1)")).toEqual([
      [
        [25.0, 121.5],
        [25.1, 121.6],
      ],
    ]);
  });
  it("解析 MULTILINESTRING 的多條線", () => {
    const lines = parseWktLines("MULTILINESTRING((121.5 25.0,121.6 25.1),(121.7 25.2, 121.8 25.3))");
    expect(lines).toHaveLength(2);
    expect(lines[1][1]).toEqual([25.3, 121.8]);
  });
  it("格式錯誤時回傳空陣列，不會拋錯", () => {
    expect(parseWktLines("BROKEN")).toEqual([]);
    expect(parseWktLines("")).toEqual([]);
    expect(parseWktLines(undefined)).toEqual([]);
    expect(parseWktLines("POINT(121 25)")).toEqual([]);
  });
  it("boundsCenter 取外框中心", () => {
    expect(boundsCenter([[[25, 121], [27, 123]]])).toEqual([26, 122]);
    expect(boundsCenter([])).toBeNull();
  });
});

describe("分頁", () => {
  const list = Array.from({ length: 14 }, (_, i) => i);
  it("每頁 6 筆", () => {
    expect(totalPages(14)).toBe(3);
    expect(totalPages(0)).toBe(1);
    expect(paginate(list, 3)).toEqual([12, 13]);
  });
  it("頁碼超出範圍會夾回去", () => {
    expect(clampPage(99, 14)).toBe(3);
    expect(clampPage(0, 14)).toBe(1);
    expect(clampPage(Number.NaN, 14)).toBe(1);
    expect(paginate(list, 99)).toEqual([12, 13]);
  });
});

describe("matchKeyword", () => {
  it("空關鍵字全部符合，特殊字元不會出錯", () => {
    expect(matchKeyword("捷運站", "")).toBe(true);
    expect(matchKeyword("捷運站", " 捷運 ")).toBe(true);
    expect(matchKeyword("捷運站", "(")).toBe(false);
    expect(matchKeyword(undefined, "a")).toBe(false);
  });
});

describe("ROAD_FILTERS", () => {
  const road = (CyclingLength: number, Direction = "雙向") =>
    ({ CyclingLength, Direction }) as CyclingShape;
  it("距離邊界值", () => {
    expect(ROAD_FILTERS.near.test(road(3000))).toBe(true);
    expect(ROAD_FILTERS.mid.test(road(3000))).toBe(false);
    expect(ROAD_FILTERS.mid.test(road(10000))).toBe(true);
    expect(ROAD_FILTERS.far.test(road(10001))).toBe(true);
  });
  it("方向", () => {
    expect(ROAD_FILTERS.two.test(road(1, "雙向"))).toBe(true);
    expect(ROAD_FILTERS.one.test(road(1, "雙向"))).toBe(false);
  });
});

describe("escapeHtml / formatLength", () => {
  it("跳脫 HTML", () => {
    expect(escapeHtml('<img src=x onerror="a">')).toBe("&lt;img src=x onerror=&quot;a&quot;&gt;");
    expect(escapeHtml(null)).toBe("");
  });
  it("長度格式", () => {
    expect(formatLength(850)).toBe("850 公尺");
    expect(formatLength(12345)).toBe("12.3 公里");
    expect(formatLength(undefined)).toBe("-");
  });
});
