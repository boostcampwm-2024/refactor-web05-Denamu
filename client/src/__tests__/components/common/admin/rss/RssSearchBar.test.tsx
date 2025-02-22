import { render, screen, fireEvent } from "@testing-library/react";
import { RssRequestSearchBar } from "@/components/admin/rss/RssSearchBar";
import { useAdminSearchStore } from "@/store/useSearchStore";
import {vi, describe, it, beforeEach, afterEach, expect, Mock} from "vitest";

vi.mock("@/store/useSearchStore", () => ({
  useAdminSearchStore: vi.fn(),
}));

describe("RssRequestSearchBar", () => {
  const mockSetSearchParam = vi.fn();
  const mockUseAdminSearchStore = useAdminSearchStore as unknown as Mock;

  beforeEach(() => {
    mockUseAdminSearchStore.mockReturnValue({
      searchParam: "",
      setSearchParam: mockSetSearchParam,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("컴포넌트가 렌더링된다", () => {
    render(<RssRequestSearchBar />);
    expect(screen.getByPlaceholderText("블로그명, URL 또는 신청자로 검색")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("입력 필드에 값을 입력하면 setSearchParam 함수가 호출된다", () => {
    render(<RssRequestSearchBar />);
    const input = screen.getByPlaceholderText("블로그명, URL 또는 신청자로 검색");
    fireEvent.change(input, { target: { value: "test" } });
    expect(mockSetSearchParam).toHaveBeenCalledWith("test");
  });

  it("입력 필드의 초기 값이 searchParam과 일치한다", () => {
    mockUseAdminSearchStore.mockReturnValueOnce({
      searchParam: "initial value",
      setSearchParam: mockSetSearchParam,
    });
    render(<RssRequestSearchBar />);
    const input = screen.getByPlaceholderText("블로그명, URL 또는 신청자로 검색");
    expect(input).toHaveValue("initial value");
  });
});