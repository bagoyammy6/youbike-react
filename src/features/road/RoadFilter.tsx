import { ROAD_FILTERS, type RoadFilterKey } from "../../lib/list";

interface Props {
  value: RoadFilterKey | null;
  onChange: (v: RoadFilterKey | null) => void;
}

const GROUPS: { title: string; keys: RoadFilterKey[] }[] = [
  { title: "距離", keys: ["near", "mid", "far"] },
  { title: "方向", keys: ["two", "one"] },
];

/** 進階篩選：直接篩選已下載的資料，不會再打 API */
export default function RoadFilter({ value, onChange }: Props) {
  return (
    <fieldset className="filter">
      <legend className="filter__title">進階篩選</legend>
      {GROUPS.map((g) => (
        <div className="filter__group" key={g.title} role="group" aria-label={g.title}>
          <span className="filter__label">{g.title}</span>
          {g.keys.map((k) => (
            <button
              key={k}
              type="button"
              className={`chip ${value === k ? "chip--on" : ""}`}
              aria-pressed={value === k}
              onClick={() => onChange(value === k ? null : k)}
            >
              {ROAD_FILTERS[k].label}
            </button>
          ))}
        </div>
      ))}
    </fieldset>
  );
}
