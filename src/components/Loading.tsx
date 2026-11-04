export default function Loading({ label = "載入中…" }: { label?: string }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
