import { describe, it, expect } from "vitest";

import PieChartItem from "@/components/chart/PieChartItem";

import { ChartPlatform } from "@/types/chart";
import { render, screen } from "@testing-library/react";

describe("PieChartItem 컴포넌트", () => {
  const mockData: ChartPlatform[] = [
    { platform: "tistory", count: 10 },
    { platform: "velog", count: 20 },
    { platform: "medium", count: 5 },
  ];

  it("제목과 함께 Card 형태로 렌더링된다", () => {
    render(<PieChartItem data={mockData} title="테스트 차트" />);

    expect(screen.getByTestId("card-header")).toBeInTheDocument();
    expect(screen.getByTestId("card-title")).toBeInTheDocument();
    expect(screen.getByTestId("card-content")).toBeInTheDocument();

    expect(screen.getByText("테스트 차트")).toBeInTheDocument();
  });

  it("데이터에 맞는 색상으로 Cell이 렌더링된다", () => {
    render(<PieChartItem data={mockData} title="테스트 차트" />);

    const cells = screen.getAllByTestId("pie-cell");
    expect(cells).toHaveLength(3);

    expect(cells[0]).toHaveAttribute("data-fill", "hsl(210, 60%, 70%)"); // tistory
    expect(cells[1]).toHaveAttribute("data-fill", "hsl(150, 60%, 70%)"); // velog
    expect(cells[2]).toHaveAttribute("data-fill", "hsl(30, 60%, 70%)"); // medium
  });

  it("차트가 올바른 구조로 렌더링된다", () => {
    render(<PieChartItem data={mockData} title="테스트 차트" />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByTestId("pie")).toBeInTheDocument();
    expect(screen.getAllByTestId("pie-cell")).toHaveLength(3);
    expect(screen.getByTestId("label-list")).toBeInTheDocument();
  });

  it("빈 데이터로도 정상적으로 렌더링된다", () => {
    render(<PieChartItem data={[]} title="빈 차트" />);

    expect(screen.getByTestId("card-header")).toBeInTheDocument();
    expect(screen.getByTestId("card-title")).toBeInTheDocument();
    expect(screen.getByTestId("card-content")).toBeInTheDocument();

    expect(screen.getByText("빈 차트")).toBeInTheDocument();
    expect(screen.queryAllByTestId("pie-cell")).toHaveLength(0);
  });

  it("알려지지 않은 플랫폼의 경우 기본 색상(#ccc)을 사용한다", () => {
    const unknownPlatformData = [{ platform: "unknown_platform" as any, count: 10 }];

    render(<PieChartItem data={unknownPlatformData} title="테스트 차트" />);

    const cell = screen.queryByTestId("pie-cell");
    expect(cell).toHaveAttribute("data-fill", "#ccc");
  });
});
