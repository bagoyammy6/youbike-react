/**
 * 字串跳脫成安全的 HTML。
 * 只有在「必須用 HTML 字串」的地方才需要 (例如 markercluster 的 popup)，
 * 一般 JSX 會自動跳脫，不需要這個。
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
