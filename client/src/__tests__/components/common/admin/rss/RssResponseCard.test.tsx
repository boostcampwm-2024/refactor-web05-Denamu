import { render, screen } from "@testing-library/react";
import { RssResponseCard } from "@/components/admin/rss/RssResponseCard";
import { AdminRssData } from "@/types/rss";
import { it, describe, expect} from "vitest";

const mockRequest: AdminRssData = {
  id: 1,
  name: "Test RSS Feed",
  rssUrl: "https://example.com/rss",
  description: "This is a test description",
  userName: "testuser",
  email: "testuser@example.com",
};

describe("RssResponseCard", () => {
  it("컴포넌트가 렌더링된다", () => {
    render(<RssResponseCard request={mockRequest} />);
    expect(screen.getByText("Test RSS Feed")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/rss")).toBeInTheDocument();
    expect(screen.getByText("거부 사유:This is a test description")).toBeInTheDocument();
    expect(screen.getByText("신청자: testuser")).toBeInTheDocument();
  });

  it("설명이 없는 경우 설명이 렌더링되지 않는다", () => {
    const requestWithoutDescription = { ...mockRequest, description: "" };
    render(<RssResponseCard request={requestWithoutDescription} />);
    expect(screen.getByText("Test RSS Feed")).toBeInTheDocument();
    expect(screen.getByText("https://example.com/rss")).toBeInTheDocument();
    expect(screen.queryByText("거부 사유:")).not.toBeInTheDocument();
    expect(screen.getByText("신청자: testuser")).toBeInTheDocument();
  });
});