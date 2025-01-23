import { describe, it, expect, vi, beforeEach } from "vitest";

import Chart from "@/components/chart/Chart";

import { useChart } from "@/hooks/queries/useChart";

import { useMediaStore } from "@/store/useMediaStore";
import { render, screen, act } from "@testing-library/react";

vi.mock("@/hooks/queries/useChart");
vi.mock("@/store/useMediaStore");
vi.mock("@/components/chart/BarChartItem", () => ({
  default: () => <div data-testid="bar-chart-item">BarChartItem</div>,
}));
vi.mock("@/components/chart/PieChartItem", () => ({
  default: () => <div data-testid="pie-chart-item">PieChartItem</div>,
}));
vi.mock("@/components/chart/ChartSkeleton", () => ({
  default: () => <div data-testid="chart-skeleton">ChartSkeleton</div>,
}));

describe("Chart", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("데이터 로딩 중일 때 ChartSkeleton을 렌더링한다", () => {
    vi.mocked(useChart).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    vi.mocked(useMediaStore).mockReturnValue(() => false);

    render(<Chart />);
    expect(screen.getByTestId("chart-skeleton")).toBeInTheDocument();
  });

  it("에러가 있을 때 에러 메시지를 렌더링한다", () => {
    vi.mocked(useChart).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });
    vi.mocked(useMediaStore).mockReturnValue(() => false);

    render(<Chart />);
    expect(screen.getByText("Error loading data")).toBeInTheDocument();
  });

  it("데이터가 있고 isMobile이 false일 때 DesktopChart 레이아웃이 올바르게 적용된다", async () => {
    vi.mocked(useChart).mockReturnValue({
      data: {
        chartAll: { message: "Success", data: [] },
        chartToday: { message: "Success", data: [] },
        chartPlatform: { message: "Success", data: [] },
      },
      isLoading: false,
      error: null,
    });
    vi.mocked(useMediaStore).mockReturnValue(false);

    await act(async () => {
      render(<Chart />);
    });

    const container = screen.getAllByText("BarChartItem")[0].closest(".p-8");
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass("p-8");

    const barCharts = screen.getAllByTestId("bar-chart-item");
    expect(barCharts).toHaveLength(2);

    const pieChart = screen.getByTestId("pie-chart-item");
    expect(pieChart).toBeInTheDocument();
  });

  it("데이터가 있고 isMobile이 true일 때 MobileChart를 렌더링한다", async () => {
    vi.mocked(useChart).mockReturnValue({
      data: {
        chartAll: { message: "Success", data: [] },
        chartToday: { message: "Success", data: [] },
        chartPlatform: { message: "Success", data: [] },
      },
      isLoading: false,
      error: null,
    });
    vi.mocked(useMediaStore).mockReturnValue(() => true);

    await act(async () => {
      render(<Chart />);
    });

    expect(screen.getAllByTestId("bar-chart-item")).toHaveLength(2);
    expect(screen.getByTestId("pie-chart-item")).toBeInTheDocument();
  });
});
