import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

import { AdminHeader } from "@/components/admin/layout/AdminHeader";
import userEvent from "@testing-library/user-event";
import { auth } from "@/api/services/admin/auth";

vi.mock("@/api/services/admin/auth", () => ({
  auth: {
    logout: vi.fn(),
  },
}));

vi.mock("@/components/admin/layout/AdminNavigationMenu", () => ({
  AdminNavigationMenu: ({ handleTap }: { handleTap: (tap: "RSS" | "MEMBER") => void }) => (
    <div data-testid="admin-nav-menu">
      <button onClick={() => handleTap("RSS")}>RSS</button>
      <button onClick={() => handleTap("MEMBER")}>MEMBER</button>
    </div>
  ),
}));

describe("AdminHeader 컴포넌트", () => {
  const mockSetLogin = vi.fn();
  const mockHandleTap = vi.fn();
  const originalLocation = window.location;

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: vi.fn() },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: originalLocation,
    });
  });

  it("로고와 네비게이션 메뉴가 정상적으로 렌더링되어야 한다", () => {
    render(<AdminHeader setLogin={mockSetLogin} handleTap={mockHandleTap} />);

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByTestId("admin-nav-menu")).toBeInTheDocument();
    expect(screen.getByTestId("user-icon")).toBeInTheDocument();
  });

  it("로고 클릭 시 페이지가 새로고침되어야 한다", () => {
    render(<AdminHeader setLogin={mockSetLogin} handleTap={mockHandleTap} />);

    const logo = screen.getByAltText("Logo");
    fireEvent.click(logo);

    expect(window.location.reload).toHaveBeenCalled();
  });

  it("네비게이션 메뉴 클릭 시 올바른 탭으로 전환되어야 한다", () => {
    render(<AdminHeader setLogin={mockSetLogin} handleTap={mockHandleTap} />);

    fireEvent.click(screen.getByText("RSS"));
    expect(mockHandleTap).toHaveBeenCalledWith("RSS");

    fireEvent.click(screen.getByText("MEMBER"));
    expect(mockHandleTap).toHaveBeenCalledWith("MEMBER");
  });

  
  it("로그아웃 버튼 클릭 시 로그아웃 처리가 되어야 한다", async () => {
    render(<AdminHeader setLogin={mockSetLogin} handleTap={mockHandleTap} />);

    await userEvent.click(screen.getByTestId("user-menu-button"));  

    const logoutButton = await screen.findByTestId("logout-button");  

    await userEvent.click(logoutButton);

    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(mockSetLogin).toHaveBeenCalledTimes(1);
  });
});
