import { useCallback } from "react";
import { useSearchParams } from "react-router";

/**
 * 把搜尋條件 (縣市、關鍵字、頁碼、篩選) 放在網址上，例如：
 *   #/findbike?city=Taipei&q=捷運&page=2
 *
 * 好處：
 * - 重新整理、上一頁/下一頁都會保留狀態
 * - 可以直接把網址分享給別人
 * - 不需要 Vuex / Redux 之類的全域 store
 */
export function useSearchParamsState() {
  const [params, setParams] = useSearchParams();

  const city = params.get("city");
  const keyword = params.get("q") ?? "";
  const page = Number(params.get("page")) || 1;
  const filter = params.get("filter");

  const update = useCallback(
    (next: Record<string, string | number | null>, replace = false) => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          Object.entries(next).forEach(([k, v]) => {
            if (v === null || v === "" || (k === "page" && v === 1)) p.delete(k);
            else p.set(k, String(v));
          });
          return p;
        },
        { replace },
      );
    },
    [setParams],
  );

  return { city, keyword, page, filter, update };
}
