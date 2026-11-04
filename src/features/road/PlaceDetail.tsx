import type { Place } from "../../api/types";
import noPictureBig from "../../assets/no_picture_big.png";

export default function PlaceDetail({ place }: { place: Place }) {
  return (
    <article className="detail">
      <img
        className="detail__img"
        src={place.picture || noPictureBig}
        alt={place.pictureAlt || place.name}
        onError={(e) => {
          e.currentTarget.src = noPictureBig;
        }}
      />
      <h2 className="detail__title">{place.name}</h2>
      <span className={`badge badge--${place.kind}`}>{place.kind === "view" ? "景點" : "餐廳"}</span>
      <dl className="detail__list">
        <InfoRow icon="fa-location-dot" label="地址" value={place.address} />
        <InfoRow icon="fa-phone" label="電話" value={place.phone} />
        <InfoRow icon="fa-clock" label="開放時間" value={place.openTime} />
        <InfoRow icon="fa-bell" label="介紹" value={place.description} />
      </dl>
    </article>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="detail__row">
      <dt>
        <i className={`fa-solid ${icon}`} aria-hidden />
        <span className="sr-only">{label}</span>
      </dt>
      <dd>{value}</dd>
    </div>
  );
}
