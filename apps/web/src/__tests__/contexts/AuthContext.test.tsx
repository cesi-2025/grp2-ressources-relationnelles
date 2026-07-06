import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Mock the API module
vi.mock("@/lib/api", () => ({
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  getMe: vi.fn(),
  setToken: vi.fn(),
  removeToken: vi.fn(),
}));

import * as apiModule from "@/lib/api";

const api = vi.mocked(apiModule);

function TestConsumer() {
  const { user, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.name : "null"}</span>
      <button onClick={() => login("a@b.c", "pass")}>Login</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});

describe("AuthProvider", () => {
  it("sets loading to false when no token", async () => {
    api.getMe.mockRejectedValue(new Error("no token"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(screen.getByTestId("user").textContent).toBe("null");
  });

  it("fetches user when token exists", async () => {
    localStorage.setItem("auth_token", "tok");
    const mockUser = { id: 1, name: "Alice", email: "a@b.c", role: "citizen", is_active: true };
    api.getMe.mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("Alice");
    });
    expect(screen.getByTestId("loading").textContent).toBe("false");
  });

  it("removes token when getMe fails", async () => {
    localStorage.setItem("auth_token", "bad-token");
    api.getMe.mockRejectedValue(new Error("Unauthorized"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });
    expect(api.removeToken).toHaveBeenCalled();
  });

  it("login stores token and sets user", async () => {
    const mockResponse = { token: "new-tok", token_type: "bearer", user: { id: 1, name: "Bob", email: "b@b.c", role: "citizen", is_active: true } };
    api.login.mockResolvedValue(mockResponse);
    api.getMe.mockRejectedValue(new Error("no token"));

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("loading").textContent).toBe("false");
    });

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("Bob");
    });
    expect(api.setToken).toHaveBeenCalledWith("new-tok");
  });

  it("logout clears user and token", async () => {
    localStorage.setItem("auth_token", "tok");
    const mockUser = { id: 1, name: "Alice", email: "a@b.c", role: "citizen", is_active: true };
    api.getMe.mockResolvedValue(mockUser);
    api.logout.mockResolvedValue({ message: "ok" });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("Alice");
    });

    await userEvent.click(screen.getByText("Logout"));

    await waitFor(() => {
      expect(screen.getByTestId("user").textContent).toBe("null");
    });
    expect(api.removeToken).toHaveBeenCalled();
  });
});

describe("useAuth", () => {
  it("throws when used outside AuthProvider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestConsumer />)).toThrow(
      "useAuth must be used within an AuthProvider"
    );

    spy.mockRestore();
  });
});
