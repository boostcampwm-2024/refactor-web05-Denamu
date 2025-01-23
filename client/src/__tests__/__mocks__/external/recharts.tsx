export const mockRecharts = {
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  BarChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bar-chart" role="img" aria-label="bar chart">
      {children}
    </div>
  ),
  CartesianGrid: () => <div data-testid="cartesian-grid">Grid</div>,
  XAxis: () => (
    <div data-testid="x-axis">
      <div data-testid="x-axis-tick">Item 1</div>
      <div data-testid="x-axis-tick">Item 2</div>
    </div>
  ),
  Bar: ({ fill }: { fill: string }) => (
    <div data-testid="bar" role="img" aria-label="bar">
      {fill}
    </div>
  ),
  Tooltip: () => <div data-testid="tooltip">Tooltip</div>,
  Legend: () => <div data-testid="legend">Legend</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: ({ fill }: { fill: string }) => <div data-testid="pie-cell" data-fill={fill} />,
  LabelList: () => <div data-testid="label-list">Labels</div>,
};
