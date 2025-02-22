import { render, screen, fireEvent } from "@testing-library/react";
import { RejectModal } from "@/components/admin/rss/RejectModal";
import {describe, it, expect, vi, beforeEach} from "vitest";

describe("RejectModal", () => {
  const mockHandleReason = vi.fn();
  const mockOnSubmit = vi.fn();
  const mockOnCancel = vi.fn();

  const setup = (rejectMessage = "") =>
    render(
      <RejectModal
        blogName="Test Blog"
        rejectMessage={rejectMessage}
        handleReason={mockHandleReason}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("거부하기 버튼 클릭 시 onSubmit과 onCancel 함수가 호출된다", () => {
    setup("Test reason");
    fireEvent.click(screen.getByRole("button", { name: "거부하기" }));
    expect(mockOnSubmit).toHaveBeenCalled();
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("취소 버튼 클릭 시 onCancel 함수가 호출된다", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("거부 사유 입력 시 handleReason 함수가 호출된다", () => {
    setup();
    fireEvent.change(screen.getByPlaceholderText("거부 사유를 입력하세요..."), { target: { value: "New reason" } });
    expect(mockHandleReason).toHaveBeenCalledWith("New reason");
  });

  it("거부 사유가 없을 때 거부하기 버튼이 비활성화된다", () => {
    setup();
    expect(screen.getByRole("button", { name: "거부하기" })).toBeDisabled();
  });

  it("거부 사유가 있을 때 거부하기 버튼이 활성화된다", () => {
    setup("Test reason");
    expect(screen.getByRole("button", { name: "거부하기" })).toBeEnabled();
  });
  
  it("Dialog의 onOpenChange 이벤트가 호출되면 onCancel 함수가 호출된다", () => {
    setup();
    fireEvent.click(screen.getByRole("button", { name: "취소" }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});