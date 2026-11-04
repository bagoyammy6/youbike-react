/**
 * 所有 TDX 請求的出口。
 *
 * 呼叫的是自己的 Cloudflare Worker (VITE_API_BASE)，Worker 會幫忙帶 token。
 * 前端完全不需要、也不應該知道 client_secret。
 * 快取、重試、合併重複請求交給 TanStack Query 處理 (見 hooks.ts)。
 */

const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

export class TdxError extends Error {
  readonly status: number;
  /** 429 時伺服器建議等待的秒數 */
  readonly retryAfter?: number;

  constructor(status: number, message: string, retryAfter?: number) {
    super(message);
    this.name = "TdxError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

export function buildUrl(path: string, params: Record<string, string> = {}): string {
  const query = Object.entries(params)
    .filter(([, v]) => v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${API_BASE}${path}${query ? `?${query}` : ""}`;
}

export async function tdxGet<T>(
  path: string,
  params: Record<string, string> = {},
  signal?: AbortSignal,
): Promise<T> {
  if (!API_BASE) {
    throw new TdxError(0, "尚未設定 VITE_API_BASE (Cloudflare Worker 網址)");
  }
  const res = await fetch(buildUrl(path, params), { signal });
  if (!res.ok) {
    const retryAfter = Number(res.headers.get("Retry-After")) || undefined;
    const message =
      res.status === 429
        ? "資料請求太頻繁 (429)，請稍等一下再試"
        : `資料載入失敗 (HTTP ${res.status})`;
    throw new TdxError(res.status, message, retryAfter);
  }
  return (await res.json()) as T;
}
