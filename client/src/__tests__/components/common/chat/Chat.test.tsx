import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { Chat } from "@/components/chat/Chat";

import { useChatStore } from "@/store/useChatStore";
import { render, screen } from "@testing-library/react";

vi.mock("@/store/useChatStore", () => ({
  useChatStore: vi.fn(),
}));
vi.mock("@/components/chat/layout/ChatHeader", () => ({
  default: () => <div data-testid="chat-header">ChatHeader</div>,
}));
vi.mock("@/components/chat/layout/ChatSection", () => ({
  default: ({ isFull }: { isFull: boolean }) => (
    <div data-testid="chat-section" data-is-full={isFull}>
      ChatSection
    </div>
  ),
}));
vi.mock("@/components/chat/layout/ChatFooter", () => ({
  default: () => <div data-testid="chat-footer">ChatFooter</div>,
}));

const renderChat = () => {
  return render(<Chat />);
};

describe("Chat", () => {
  const mockConnect = vi.fn();
  const mockDisconnect = vi.fn();
  const mockGetHistory = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      userCount: 0,
      connect: mockConnect,
      disconnect: mockDisconnect,
      getHistory: mockGetHistory,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("초기 소켓 연결 및 히스토리 로드", () => {
    it("컴포넌트 마운트 시 connect와 getHistory가 호출되어야 한다", () => {
      renderChat();

      expect(mockConnect).toHaveBeenCalledTimes(1);
      expect(mockGetHistory).toHaveBeenCalledTimes(1);
    });
  });

  describe("컴포넌트 언마운트", () => {
    it("언마운트 시 disconnect가 호출되어야 한다", () => {
      const { unmount } = renderChat();

      unmount();

      expect(mockDisconnect).toHaveBeenCalledTimes(1);
    });
  });

  describe("유저 수에 따른 isFull 상태 관리", () => {
    it("userCount가 500 이상일 때 isFull이 true여야 한다", () => {
      (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        userCount: 500,
        connect: mockConnect,
        disconnect: mockDisconnect,
        getHistory: mockGetHistory,
      });

      renderChat();

      const chatSection = screen.getByTestId("chat-section");
      expect(chatSection).toHaveAttribute("data-is-full", "true");
    });

    it("userCount가 500 미만일 때 isFull이 false여야 한다", () => {
      (useChatStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        userCount: 499,
        connect: mockConnect,
        disconnect: mockDisconnect,
        getHistory: mockGetHistory,
      });

      renderChat();

      const chatSection = screen.getByTestId("chat-section");
      expect(chatSection).toHaveAttribute("data-is-full", "false");
    });
  });

  describe("레이아웃 컴포넌트 렌더링", () => {
    it("필요한 모든 하위 컴포넌트가 렌더링되어야 한다", () => {
      renderChat();

      expect(screen.getByTestId("sidebar")).toBeInTheDocument();
      expect(screen.getByTestId("sidebar-content")).toBeInTheDocument();
      expect(screen.getByTestId("chat-header")).toBeInTheDocument();
      expect(screen.getByTestId("chat-section")).toBeInTheDocument();
      expect(screen.getByTestId("chat-footer")).toBeInTheDocument();
    });
  });
});
