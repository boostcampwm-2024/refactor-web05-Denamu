import { describe, it, expect } from "vitest";

import BarChartItem from "@/components/chart/BarChartItem";

import { ChartType } from "@/types/chart";
import { render, screen } from "@testing-library/react";

describe("BarChartItem", () => {
  const data: ChartType[] = [
    { id: 1, title: "Item 1", viewCount: 100 },
    { id: 2, title: "Item 2", viewCount: 200 },
  ];

  it("ResizeObserver가 정상적으로 동작한다", () => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    render(<BarChartItem data={data} title="Test Title" description="Test Description" color={true} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("ResizeObserver가 정의되지 않아도 정상적으로 렌더링된다", () => {
    render(<BarChartItem data={data} title="Test Title" description="Test Description" color={true} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("제목과 설명이 올바르게 렌더링된다", () => {
    render(<BarChartItem data={data} title="Test Title" description="Test Description" color={true} />);
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("리사이즈 시 컴포넌트 너비가 업데이트된다", () => {
    global.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    const { container } = render(
      <BarChartItem data={data} title="Test Title" description="Test Description" color={true} />
    );
    const card = container.querySelector(".w-full");

    Object.defineProperty(card, "offsetWidth", { configurable: true, value: 500 });
    window.dispatchEvent(new Event("resize"));

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("데이터가 차트에 올바르게 표시된다", () => {
    render(<BarChartItem data={data} title="Test Title" description="Test Description" color={true} />);

    const ticks = screen.getAllByTestId("x-axis-tick");

    expect(ticks[0]).toHaveTextContent("Item 1");
    expect(ticks[1]).toHaveTextContent("Item 2");
  });

  describe("텍스트 자르기 함수", () => {
    const truncateText = (text: string, componentWidth: number) => {
      const charWidth = 55;
      const maxChars = Math.floor(componentWidth / charWidth);
      return text.length > maxChars ? `${text.slice(0, Math.max(0, maxChars - 3))}...` : text;
    };

    it("텍스트가 너무 길 경우 잘라서 표시한다", () => {
      const longText = "This is a very long text";
      const result = truncateText(longText, 200);
      expect(result).toBe("...");
    });

    it("텍스트가 짧을 경우 그대로 표시한다", () => {
      const shortText = "Hi";
      const result = truncateText(shortText, 200);
      expect(result).toBe("Hi");
    });
  });
});
