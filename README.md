# YouBike 資訊網（React 版）

[原本的 Vue 版](https://github.com/bagoyammy6/Vue)用 React 改寫的版本，功能相同：

- **尋找單車**：選擇縣市、輸入站名，查看即時可借車輛與空位，並在地圖上顯示
- **尋找車道**：選擇縣市、輸入車道名稱，依距離或方向篩選，並查看車道附近的景點與餐廳

## 技術選擇

| 用途 | 套件 | 為什麼選它 |
| --- | --- | --- |
| 建置工具 | [Vite](https://vite.dev/) | 目前 React 官方推薦的起手方式，啟動和打包都很快（Create React App 已停止維護） |
| 語言 | TypeScript | 先定義好 API 資料的型別（`src/api/types.ts`），打錯欄位名稱時編輯器就會提醒 |
| 資料請求 | [TanStack Query](https://tanstack.com/query) | 內建快取、合併重複請求、429 重試，這正是舊版缺少、導致 429 的部分 |
| 路由 | [React Router](https://reactrouter.com/) | 搜尋條件存在網址上（`?city=Taipei&q=捷運&page=2`），重新整理不會遺失，也能分享網址 |
| 地圖 | [react-leaflet](https://react-leaflet.js.org/) + leaflet.markercluster | 和 Vue 版一樣用 Leaflet，換成 React 的寫法 |
| 測試 | [Vitest](https://vitest.dev/) + Testing Library | 和 Vite 共用設定，不用另外設定 |

## 開始使用

### 1. 先部署 Cloudflare Worker

React 版和 Vue 版**共用同一個 Worker**，TDX 金鑰只放在 Worker 裡，前端看不到。
部署步驟請看 Vue repo 的 [docs/升級教學.md](https://github.com/bagoyammy6/Vue/blob/main/docs/%E5%8D%87%E7%B4%9A%E6%95%99%E5%AD%B8.md) 第 1、2 節。

> Worker 的 `ALLOWED_ORIGINS` 已包含 `https://bagoyammy6.github.io`（兩個網站同網域）和本機開發用的 `http://localhost:5173`，不需要另外修改。

### 2. 本機開發

```bash
npm install
```

```bash
cp .env.example .env.local
```

打開 `.env.local`，把 `VITE_API_BASE` 改成你的 Worker 網址，然後：

```bash
npm run dev
```

打開 <http://localhost:5173> 就能看到網站。

### 3. 部署到 GitHub Pages（自動）

1. 到這個 repo 的 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**。
2. 到 **Settings → Secrets and variables → Actions → Variables**，新增：
   - `VITE_API_BASE`：你的 Worker 網址（必填）
   - `VITE_MAPBOX_TOKEN`：Mapbox public token（選填，不填就用 OpenStreetMap）
3. 之後每次 push 到 `main`，[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 都會自動執行 lint、測試、打包並部署。
4. 網址：<https://bagoyammy6.github.io/youbike-react/>

## 常用指令

| 指令 | 用途 |
| --- | --- |
| `npm run dev` | 開發模式（存檔後自動更新畫面） |
| `npm run build` | 型別檢查 + 打包到 `dist/` |
| `npm run preview` | 在本機預覽打包後的結果 |
| `npm test` | 執行單元測試 |
| `npm run lint` | 檢查程式碼 |

## 資料夾結構

```
src/
├── api/            # 和 TDX 溝通
│   ├── types.ts    #   API 資料的型別
│   ├── tdx.ts      #   fetch + 錯誤處理
│   └── hooks.ts    #   useStations / useAvailability / useCyclingShapes / useNearbyPlaces
├── lib/            # 純函式 (沒有畫面，最容易測試)
│   ├── geometry.ts #   解析車道 WKT 座標
│   ├── list.ts     #   分頁、關鍵字比對、距離/方向篩選
│   ├── counties.ts #   縣市代碼
│   └── format.ts   #   時間、長度格式
├── hooks/
│   └── useSearchParamsState.ts  # 把搜尋條件存在網址上
├── components/     # 共用元件 (導覽列、搜尋表單、分頁、地圖…)
│   └── map/
├── features/       # 依功能分的元件
│   ├── bike/
│   └── road/
├── pages/          # 每個路由一個頁面
├── router.tsx
└── main.tsx
```

## 從 Vue 版到 React 版：觀念對照

如果你熟悉 Vue，可以用下表對照：

| Vue 版的寫法 | React 版的寫法 | 說明 |
| --- | --- | --- |
| Vuex store（50 多個 state + mutation） | 網址參數 + `useState` + TanStack Query | 「伺服器資料」交給 TanStack Query，「搜尋條件」放網址，「畫面狀態」用 `useState`，就不需要全域 store |
| `data()` 複製 store 的值，再用 `watch` 同步 | 直接從 hook 讀值 | 舊版很多 bug 來自「兩份資料沒有同步」。React 版每份資料只有一個來源 |
| `beforeMount` 裡 fetch | `useQuery` | 自動處理 loading、error、快取、重試 |
| `v-if` / `v-for` | `{cond && ...}` / `.map()` | JSX 就是 JavaScript |
| `v-html` + 字串拼接 | JSX 元素（例如 `<Highlight>`） | JSX 會自動跳脫文字，天生不會有 XSS |
| `document.addEventListener` 關閉下拉選單 | 原生 `<select>` | 少一段要維護的程式碼，鍵盤和手機也能正常操作 |
| 雙擊卡片進入下一層 | 卡片上的「附近景點與美食」、「詳細介紹」按鈕 | 雙擊在手機上很難發現，也不好操作 |
| 手動操作 Leaflet（`L.marker(...).addTo(map)`） | `<Marker>`、`<Polyline>`、`<Popup>` 元件 | 只有 markercluster 這種沒有 React 版本的套件，才用 `useMap()` 手動操作 |

## 和 Vue 版的差異

- 車道頁不再一次載入整個縣市的景點和餐廳（可能有好幾千筆），只在選擇車道後載入附近的資料，載入更快，也更不容易 429。
- 即時車輛數每分鐘會自動更新（切到背景分頁時會暫停）。
- 不需要拆成「一般分頁」和「進階篩選分頁」兩套邏輯：篩選條件和頁碼都在網址上，只有一套分頁。
