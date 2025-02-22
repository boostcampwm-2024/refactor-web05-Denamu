import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminMember from "@/components/admin/layout/AdminMember";

vi.mock("@/hooks/queries/useAdminAuth", () => ({
  useAdminRegister: (onSuccess: Mock, onError: Mock) => ({
    mutate: (data: { loginId: string; password: string }) => {
      if (data.loginId === "fail") {
        onError({ response: { data: "아이디가 올바르지 않습니다." } });
      } else {
        onSuccess({ message: "생성완료" });
      }
    },
  }),
}));

const mockAlert = vi.fn();
vi.stubGlobal("alert", mockAlert);

describe("AdminMember", () => {
  const queryClient = new QueryClient();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <AdminMember />
      </QueryClientProvider>
    );

  it("컴포넌트가 초기 렌더링될 때 기본 요소가 표시되어야 한다", () => {
    setup();
    expect(screen.getByText("관리자 계정 생성")).toBeInTheDocument();
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "가입" })).toBeInTheDocument();
  });

  it("Password Toggle 버튼 클릭 시 비밀번호 표시/숨기기가 전환되어야 한다", async () => {
    setup();
    const toggleButton = screen.getByRole("button", { name: "Toggle bold" });
    const passwordInput = screen.getByLabelText("Password") as HTMLInputElement;

    expect(passwordInput.type).toBe("password");
    await userEvent.click(toggleButton);
    expect(passwordInput.type).toBe("text");
    await userEvent.click(toggleButton);
    expect(passwordInput.type).toBe("password");
  });

  it("ID와 Password 입력 후 가입 시 onSuccess가 호출되어 폼이 초기화되어야 한다", async () => {
    setup();
    const idInput = screen.getByLabelText("ID") as HTMLInputElement;
    const pwInput = screen.getByLabelText("Password") as HTMLInputElement;
    const submitBtn = screen.getByRole("button", { name: "가입" });

    await userEvent.type(idInput, "admin");
    await userEvent.type(pwInput, "adminpw");
    fireEvent.click(submitBtn);

    expect(mockAlert).toHaveBeenCalledWith("관리자 등록 성공: 생성완료");
    expect(idInput.value).toBe("");
    expect(pwInput.value).toBe("");
  });

  it("ID가 'fail'일 때 가입 시 onError가 호출되어 에러 알림이 표시되어야 한다", async () => {
    setup();
    const idInput = screen.getByLabelText("ID");
    const pwInput = screen.getByLabelText("Password");
    const submitBtn = screen.getByRole("button", { name: "가입" });

    await userEvent.type(idInput, "fail");
    await userEvent.type(pwInput, "somepassword");
    fireEvent.click(submitBtn);

    expect(mockAlert).toHaveBeenCalledWith(
      '관리자 등록 실패: "아이디가 올바르지 않습니다."'
    );
  });
});