import { describe, it, expect, vi } from "vitest";

import ChartTab from "@/components/chart/ChartTab";

import { act, render, screen } from "@testing-library/react";

vi.mock("@/components/chart/Chart", () => ({
  default: vi.fn(() => <div data-testid="chart">Chart Component</div>),
}));
vi.mock("@/components/chart/ChartSkeleton", () => ({
  default: vi.fn((props) => <div data-testid={props["data-testid"]}>Chart Skeleton</div>),
}));

describe("ChartTab 컴포넌트", () => {
  it("초기 로딩시 ChartSkeleton을 표시한다", async () => {
    render(<ChartTab />);

    expect(screen.getByTestId("chart-skeleton")).toBeInTheDocument();
  });

  it("Chart 컴포넌트가 로드되면 ChartSkeleton이 사라진다", async () => {
    render(<ChartTab />);

    const chart = await screen.findByTestId("chart");

    expect(chart).toBeInTheDocument();
    expect(screen.queryByTestId("chart-skeleton")).not.toBeInTheDocument();
  });

  it("Chart 컴포넌트 로딩 과정이 정상적으로 동작한다", async () => {
    await act(async () => {
      render(<ChartTab />);
    });

    const skeleton = screen.getByTestId("chart");
    expect(skeleton).toBeInTheDocument();

    const chart = await screen.findByTestId("chart");
    expect(chart).toBeInTheDocument();

    expect(screen.queryByTestId("chart-skeleton")).not.toBeInTheDocument();
  });
});
