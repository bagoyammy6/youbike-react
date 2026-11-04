import type { Availability, Station } from "../../api/types";
import Highlight from "../../components/Highlight";

interface Props {
  station: Station;
  availability?: Availability;
  keyword: string;
  active: boolean;
  onSelect: (s: Station) => void;
}

const SERVICE_STATUS: Record<number, { label: string; tone: string }> = {
  0: { label: "停止營運", tone: "muted" },
  1: { label: "正常營運", tone: "ok" },
  2: { label: "暫停營運", tone: "warn" },
};

export default function BikeCard({ station, availability: a, keyword, active, onSelect }: Props) {
  const status = a ? SERVICE_STATUS[a.ServiceStatus] : undefined;
  return (
    <li>
      <button
        type="button"
        className={`card ${active ? "card--active" : ""}`}
        onClick={() => onSelect(station)}
      >
        <span className="card__title">
          <Highlight text={station.StationName.Zh_tw} keyword={keyword} />
        </span>
        <span className="card__row">
          <i className="fa-solid fa-location-dot" aria-hidden />
          {station.StationAddress?.Zh_tw}
        </span>
        <span className="card__badges">
          {status && <span className={`badge badge--${status.tone}`}>{status.label}</span>}
          {a && a.AvailableRentBikes > 0 && (
            <span className="badge badge--ok">可借 {a.AvailableRentBikes}</span>
          )}
          {a && a.AvailableRentBikes === 0 && <span className="badge badge--danger">已無單車</span>}
          {a && a.AvailableReturnBikes === 0 && <span className="badge badge--danger">車位已滿</span>}
          {a && a.AvailableReturnBikes > 0 && (
            <span className="badge">空位 {a.AvailableReturnBikes}</span>
          )}
          {!a && <span className="badge badge--muted">無即時資料</span>}
        </span>
      </button>
    </li>
  );
}
