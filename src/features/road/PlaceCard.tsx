import type { Place } from "../../api/types";
import noPicture from "../../assets/no_picture.png";

interface Props {
  place: Place;
  active: boolean;
  onSelect: (p: Place) => void;
  onDetail: (p: Place) => void;
}

export default function PlaceCard({ place, active, onSelect, onDetail }: Props) {
  return (
    <li className={`card card--place ${active ? "card--active" : ""}`}>
      <button type="button" className="card__main card__main--row" onClick={() => onSelect(place)}>
        <img
          className="card__thumb"
          src={place.picture || noPicture}
          alt={place.pictureAlt || place.name}
          width={88}
          height={88}
          loading="lazy"
          onError={(e) => {
            // 圖片網址失效時換成預設圖
            e.currentTarget.src = noPicture;
          }}
        />
        <span>
          <span className="card__title">{place.name}</span>
          <span className="card__row">
            <i className="fa-solid fa-location-dot" aria-hidden />
            {place.city || place.address}
          </span>
          <span className={`badge badge--${place.kind}`}>{place.kind === "view" ? "景點" : "餐廳"}</span>
        </span>
      </button>
      <button type="button" className="btn btn--ghost card__action" onClick={() => onDetail(place)}>
        詳細介紹 <i className="fa-solid fa-angle-right" aria-hidden />
      </button>
    </li>
  );
}
