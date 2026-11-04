import { useState, type FormEvent } from "react";
import type { CityMap } from "../lib/counties";

interface Props {
  cities: CityMap;
  city: string | null;
  keyword: string;
  placeholder: string;
  onSearch: (city: string, keyword: string) => void;
  className?: string;
}

/**
 * 縣市 + 關鍵字搜尋表單。
 * 用原生 <select> 和 <form>：鍵盤、手機、螢幕閱讀器都能正常使用，
 * 也不需要自己寫「點外面關閉選單」的邏輯。
 */
export default function SearchForm({
  cities,
  city,
  keyword,
  placeholder,
  onSearch,
  className = "",
}: Props) {
  const [draftCity, setDraftCity] = useState(city ?? "");
  const [draftKeyword, setDraftKeyword] = useState(keyword);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!draftCity) {
      alert("請選擇縣市");
      return;
    }
    onSearch(draftCity, draftKeyword.trim());
  }

  return (
    <form className={`search ${className}`} onSubmit={handleSubmit} role="search">
      <label className="search__keyword">
        <i className="fa-solid fa-magnifying-glass" aria-hidden />
        <input
          type="search"
          name="keyword"
          value={draftKeyword}
          placeholder={placeholder}
          onChange={(e) => setDraftKeyword(e.target.value)}
        />
      </label>
      <div className="search__row">
        <select
          className="search__city"
          name="city"
          aria-label="選擇縣市"
          value={draftCity}
          onChange={(e) => setDraftCity(e.target.value)}
        >
          <option value="" disabled>
            縣市
          </option>
          {Object.entries(cities).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--primary">
          搜尋
        </button>
      </div>
    </form>
  );
}
