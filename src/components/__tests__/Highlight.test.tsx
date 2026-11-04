import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import Highlight from "../Highlight";

describe("Highlight", () => {
  it("標出關鍵字，且資料中的 HTML 只會被當成文字", () => {
    const { container } = render(<Highlight text="捷運<b>站</b>捷運" keyword="捷運" />);
    expect(container.querySelectorAll("mark")).toHaveLength(2);
    expect(container.querySelector("b")).toBeNull();
    expect(container.textContent).toBe("捷運<b>站</b>捷運");
  });
});
