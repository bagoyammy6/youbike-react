/**
 * 關鍵字標色。
 * 用 React 元素組合而不是 dangerouslySetInnerHTML，所以資料裡就算有 <script> 也只會被當成文字。
 */
export default function Highlight({ text, keyword }: { text: string; keyword: string }) {
  const k = keyword.trim();
  if (!k) return <>{text}</>;
  const parts = text.split(k);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <mark className="highlight">{k}</mark>}
        </span>
      ))}
    </>
  );
}
