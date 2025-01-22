import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminTabs } from "@/components/admin/layout/AdminTabs";
import { useFetchRss, useFetchAccept, useFetchReject } from "@/hooks/queries/useFetchRss";
import { useAdminAccept, useAdminReject } from "@/hooks/queries/useRssActions";

vi.mock("@/hooks/queries/useFetchRss", () => ({
  useFetchRss: vi.fn(),
  useFetchAccept: vi.fn(),
  useFetchReject: vi.fn(),
}));

vi.mock("@/hooks/queries/useRssActions", () => ({
  useAdminAccept: vi.fn(),
  useAdminReject: vi.fn(),
}));

const mockSetLogout = vi.fn();
const queryClient = new QueryClient();

const setup = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <AdminTabs setLogout={mockSetLogout} />
    </QueryClientProvider>
  );

describe("AdminTabs", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAdminAccept as Mock).mockReturnValue({ mutate: vi.fn() });
    (useAdminReject as Mock).mockReturnValue({ mutate: vi.fn() });
  });

  it("로딩 중일 때 로딩 메시지를 표시해야 한다", () => {
    (useFetchRss as Mock).mockReturnValue({ isLoading: true });
    (useFetchAccept as Mock).mockReturnValue({ isLoading: true });
    (useFetchReject as Mock).mockReturnValue({ isLoading: true });

    setup();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("에러 발생 시 에러 메시지를 표시해야 한다", () => {
    (useFetchRss as Mock).mockReturnValue({ error: true });
    (useFetchAccept as Mock).mockReturnValue({ error: true });
    (useFetchReject as Mock).mockReturnValue({ error: true });

    setup();

    expect(screen.getByText("세션이 만료되었습니다!")).toBeInTheDocument();
    expect(screen.getByText("서비스를 계속 사용하려면 로그인하세요.")).toBeInTheDocument();
  });

  it("탭과 데이터를 정상적으로 렌더링해야 한다", () => {
    (useFetchRss as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    (useFetchAccept as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    (useFetchReject as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });

    setup();

    expect(screen.getByText("대기 중")).toBeInTheDocument();
    expect(screen.getByText("승인됨")).toBeInTheDocument();
    expect(screen.getByText("거부됨")).toBeInTheDocument();
  });

  it("대기 중 탭에서 승인 버튼 클릭 시 handleActions가 호출되어야 한다", () => {
    const mockAcceptMutate = vi.fn();
    (useFetchRss as Mock).mockReturnValue({ data: { data: [{ id: 1, name: "Test RSS" }] }, isLoading: false });
    (useFetchAccept as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    (useFetchReject as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    (useAdminAccept as Mock).mockReturnValue({ mutate: mockAcceptMutate });

    setup();

    const approveButton = screen.getByText("승인");
    fireEvent.click(approveButton);

    expect(mockAcceptMutate).toHaveBeenCalledWith({ id: 1, name: "Test RSS" });
  });

  it("대기 중 탭에서 거부 버튼 클릭 시 handleSelectedBlog가 호출되어야 한다", () => {
    (useFetchRss as Mock).mockReturnValue({ data: { data: [{ id: 1, name: "Test RSS" }] }, isLoading: false });
    (useFetchAccept as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });
    (useFetchReject as Mock).mockReturnValue({ data: { data: [] }, isLoading: false });

    setup();

    const rejectButton = screen.getByText("거부");
    fireEvent.click(rejectButton);

    expect(screen.getByText("Test RSS")).toBeInTheDocument();
  });
});