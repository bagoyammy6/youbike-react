interface Props {
  page: number;
  total: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, total, onChange }: Props) {
  return (
    <nav className="pagination" aria-label="分頁">
      <button
        type="button"
        className="pagination__btn"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="上一頁"
      >
        <i className="fa-solid fa-angle-left" aria-hidden />
      </button>
      <span className="pagination__label">
        {page} <span className="muted">/ {total}</span>
      </span>
      <button
        type="button"
        className="pagination__btn"
        disabled={page >= total}
        onClick={() => onChange(page + 1)}
        aria-label="下一頁"
      >
        <i className="fa-solid fa-angle-right" aria-hidden />
      </button>
    </nav>
  );
}
