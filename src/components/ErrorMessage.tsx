import { TdxError } from "../api/tdx";

interface Props {
  error: unknown;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: Props) {
  const message =
    error instanceof TdxError ? error.message : "發生未預期的錯誤，請稍後再試";
  return (
    <div className="message message--error" role="alert">
      <i className="fa-solid fa-triangle-exclamation" aria-hidden />
      <span>{message}</span>
      {onRetry && (
        <button type="button" className="btn btn--ghost" onClick={onRetry}>
          重試
        </button>
      )}
    </div>
  );
}
