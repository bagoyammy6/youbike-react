export function formatTime(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("zh-TW", { hour12: false });
}

export function formatLength(meters: number | undefined): string {
  if (meters == null || !Number.isFinite(meters)) return "-";
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} 公里` : `${Math.round(meters)} 公尺`;
}
