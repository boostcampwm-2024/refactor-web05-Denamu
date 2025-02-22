import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AdminNavigationMenu, TAB_TYPES } from "@/components/admin/layout/AdminNavigationMenu";

describe("AdminNavigationMenu", () => {
  it("컴포넌트가 초기 렌더링될 때, 기본 요소가 표시되어야 한다", () => {
    render(<AdminNavigationMenu handleTap={vi.fn()} />);
    expect(screen.getByText("RSS 목록")).toBeInTheDocument();
    expect(screen.getByText("회원 관리")).toBeInTheDocument();
  });

  it("RSS 목록 버튼 클릭 시 handleTap이 RSS로 호출되어야 한다", () => {
    const handleTap = vi.fn();
    render(<AdminNavigationMenu handleTap={handleTap} />);

    const rssButton = screen.getByText("RSS 목록");
    fireEvent.click(rssButton);

    expect(handleTap).toHaveBeenCalledWith(TAB_TYPES.RSS);
  });

  it("회원 관리 버튼 클릭 시 handleTap이 MEMBER로 호출되어야 한다", () => {
    const handleTap = vi.fn();
    render(<AdminNavigationMenu handleTap={handleTap} />);

    const memberButton = screen.getByText("회원 관리");
    fireEvent.click(memberButton);

    expect(handleTap).toHaveBeenCalledWith(TAB_TYPES.MEMBER);
  });
});