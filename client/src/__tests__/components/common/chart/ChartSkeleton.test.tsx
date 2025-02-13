import { describe, it, expect, vi } from "vitest";

import ChartSkeleton from "@/components/chart/ChartSkeleton";

import { render, screen } from "@testing-library/react";

vi.mock("@/components/chart/BarChartItem", () => ({
  default: vi.fn(({ title, description, data, color }) => (
    <div data-testid="bar-chart-item" data-title={title} data-description={description} data-color={color}>
      <div>Mock BarChartItem</div>
      <div>Data Length: {data.length}</div>
    </div>
  )),
}));
vi.mock("@/components/chart/PieChartItem", () => ({
  default: vi.fn(({ title, data }) => (
    <div data-testid="pie-chart-item" data-title={title}>
      <div>Mock PieChartItem</div>
      <div>Data Length: {data.length}</div>
    </div>
  )),
}));

describe("ChartSkeleton", () => {
  it("should render the component with correct structure", () => {
    render(<ChartSkeleton />);

    const container = screen.getByTestId("chart-skeleton-container");
    expect(container).toHaveClass("p-8");
  });

  describe("BarChartItem 렌더링", () => {
    it("전체 조회수 차트가 올바른 props로 렌더링되어야 한다", () => {
      render(<ChartSkeleton />);

      const totalViewsChart = screen.getAllByTestId("bar-chart-item")[0];
      expect(totalViewsChart).toHaveAttribute("data-title", "전체 조회수");
      expect(totalViewsChart).toHaveAttribute("data-description", "전체 조회수 TOP5");
      expect(totalViewsChart).toHaveAttribute("data-color", "true");
    });

    it("오늘의 조회수 차트가 올바른 props로 렌더링되어야 한다", () => {
      render(<ChartSkeleton />);

      const todayViewsChart = screen.getAllByTestId("bar-chart-item")[1];
      expect(todayViewsChart).toHaveAttribute("data-title", "오늘의 조회수");
      expect(todayViewsChart).toHaveAttribute("data-description", "금일 조회수 TOP5");
      expect(todayViewsChart).toHaveAttribute("data-color", "false");
    });
  });

  describe("PieChartItem 렌더링", () => {
    it("플랫폼별 블로그 수 차트가 올바른 props로 렌더링되어야 한다", () => {
      render(<ChartSkeleton />);

      const platformChart = screen.getByTestId("pie-chart-item");
      expect(platformChart).toHaveAttribute("data-title", "플랫폼별 블로그 수");
    });
  });

  describe("데이터 전달", () => {
    it("모든 차트 컴포넌트에 빈 데이터 배열이 전달되어야 한다", () => {
      render(<ChartSkeleton />);

      const barCharts = screen.getAllByTestId("bar-chart-item");
      const pieChart = screen.getByTestId("pie-chart-item");

      barCharts.forEach((chart) => {
        expect(chart.textContent).toContain("Data Length: 0");
      });
      expect(pieChart.textContent).toContain("Data Length: 0");
    });
  });
});
