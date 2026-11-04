import type { CyclingShape } from "../api/types";

export const PAGE_SIZE = 6;

export function totalPages(length: number): number {
  return Math.max(1, Math.ceil(length / PAGE_SIZE));
}

/** 頁碼超出範圍時自動夾回 1..總頁數 */
export function clampPage(page: number, length: number): number {
  if (!Number.isFinite(page)) return 1;
  return Math.min(Math.max(1, Math.floor(page)), totalPages(length));
}

export function paginate<T>(list: readonly T[], page: number): T[] {
  const p = clampPage(page, list.length);
  return list.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);
}

/** 純文字比對關鍵字 (不用正規表示式，輸入 "(" 之類的字元也不會壞) */
export function matchKeyword(text: string | undefined, keyword: string): boolean {
  const k = keyword.trim();
  return !k || (text ?? "").includes(k);
}

export const ROAD_FILTERS = {
  near: { label: "近 (3 公里內)", test: (r: CyclingShape) => r.CyclingLength <= 3000 },
  mid: {
    label: "中 (3～10 公里)",
    test: (r: CyclingShape) => r.CyclingLength > 3000 && r.CyclingLength <= 10000,
  },
  far: { label: "遠 (10 公里以上)", test: (r: CyclingShape) => r.CyclingLength > 10000 },
  two: { label: "雙向", test: (r: CyclingShape) => r.Direction === "雙向" },
  one: { label: "單向", test: (r: CyclingShape) => r.Direction === "單向" },
} as const;

export type RoadFilterKey = keyof typeof ROAD_FILTERS;

export function isRoadFilterKey(v: string | null): v is RoadFilterKey {
  return !!v && v in ROAD_FILTERS;
}
