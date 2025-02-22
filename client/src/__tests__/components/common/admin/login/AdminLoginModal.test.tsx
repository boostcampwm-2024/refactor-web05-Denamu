import { render, screen, fireEvent } from "@testing-library/react";
import { AxiosError } from "axios";

import { vi, describe, it, beforeEach, expect } from "vitest";
import AdminLogin from "@/components/admin/login/AdminLoginModal";

vi.mock("@/hooks/queries/useAdminAuth", () => ({
  useAdminAuth: (
    onSuccess: () => void,
    onError: (error: AxiosError<unknown, unknown>) => void
  ) => ({
    mutate: (data: { loginId: string; password: string }) => {
      if (data.loginId === "admin" && data.password === "password") {
        onSuccess();
      } else {
        onError(new AxiosError("Invalid credentials"));
      }
    },
  }),
}));

vi.mock("@/hooks/common/useKeyboardShortcut", () => ({
  useKeyboardShortcut: (key: string, callback: () => void) => {
    document.addEventListener("keydown", (event) => {
      if (event.key === key) {
        callback();
      }
    });
  },
}));

describe("AdminLogin", () => {
  const setLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const setup = () =>
    render(<AdminLogin setLogin={setLogin} />);

    it("로그인 폼이 렌더링된다", () => {
    setup();
    expect(screen.getByText("관리자 로그인")).toBeInTheDocument();
    expect(screen.getByLabelText("ID")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "로그인" })).toBeInTheDocument();
  });
  
  it("로그인 실패 시 오류 알림이 표시된다", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByText("로그인 실패")).toBeInTheDocument();
    expect(screen.getByText("아이디 또는 비밀번호를 확인하세요.")).toBeInTheDocument();
  });
  
  it("로그인 성공 시 setLogin 함수가 호출된다", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(setLogin).toHaveBeenCalled();
  });
  
  it("Enter 키를 눌러 로그인 시도 시 setLogin 함수가 호출된다", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "admin" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "password" } });
    fireEvent.keyDown(document, { key: "Enter" });
    expect(setLogin).toHaveBeenCalled();
  });
  
  it("오류 알림의 확인 버튼을 클릭하면 오류 알림이 닫힌다", async () => {
    setup();
    fireEvent.change(screen.getByLabelText("ID"), { target: { value: "wrong" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "wrong" } });
    fireEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByText("로그인 실패")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "확인" }));
    expect(screen.queryByText("로그인 실패")).not.toBeInTheDocument();
  });
});