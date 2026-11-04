import type { CyclingShape } from "../../api/types";
import Highlight from "../../components/Highlight";
import { formatLength } from "../../lib/format";

interface Props {
  road: CyclingShape;
  keyword: string;
  active: boolean;
  onSelect: (r: CyclingShape) => void;
  onShowNearby: (r: CyclingShape) => void;
}

export default function RoadCard({ road, keyword, active, onSelect, onShowNearby }: Props) {
  return (
    <li className={`card card--road ${active ? "card--active" : ""}`}>
      <button type="button" className="card__main" onClick={() => onSelect(road)}>
        <span className="card__title">
          <Highlight text={road.RouteName} keyword={keyword} />
        </span>
        <span className="card__row">
          <i className="fa-solid fa-location-dot" aria-hidden />
          {road.City} {road.Town}
        </span>
        <span className="card__row card__row--split">
          <span>
            <i className="fa-solid fa-arrow-right-arrow-left" aria-hidden />
            {road.Direction || "-"}
          </span>
          <span>
            <i className="fa-solid fa-route" aria-hidden />
            {formatLength(road.CyclingLength)}
          </span>
        </span>
        <span className="card__row">
          <b className="card__tag">開始</b>
          {road.RoadSectionStart || "-"}
        </span>
        <span className="card__row">
          <b className="card__tag">結束</b>
          {road.RoadSectionEnd || "-"}
        </span>
      </button>
      <button type="button" className="btn btn--ghost card__action" onClick={() => onShowNearby(road)}>
        附近景點與美食 <i className="fa-solid fa-angle-right" aria-hidden />
      </button>
    </li>
  );
}
