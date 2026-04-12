import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

jest.unmock("@/lib/tokenStorage");

function SignInProbe() {
  const { isReady, isLoggedIn, user, signIn, signOut } = useAuth();

  if (!isReady) {
    return <Text>boot</Text>;
  }

  return (
    <>
      <Text testID="ready">ok</Text>
      <Text testID="logged">{isLoggedIn ? "in" : "out"}</Text>
      {user ? <Text testID="email">{user.email}</Text> : null}
      <Pressable testID="signin" onPress={() => void signIn("u@e.com", "pw")}>
        <Text>signin</Text>
      </Pressable>
      <Pressable testID="signout" onPress={() => void signOut()}>
        <Text>signout</Text>
      </Pressable>
    </>
  );
}

describe("AuthProvider", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    const SecureStore = require("expo-secure-store");
    SecureStore.getItemAsync.mockResolvedValue(null);
    SecureStore.setItemAsync.mockResolvedValue(undefined);
    SecureStore.deleteItemAsync.mockResolvedValue(undefined);
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("passe isReady à true sans token stocké", async () => {
    render(
      <AuthProvider>
        <SignInProbe />
      </AuthProvider>,
    );

    expect(screen.getByText("boot")).toBeTruthy();

    await waitFor(() => {
      expect(screen.getByTestId("ready")).toBeTruthy();
    });

    expect(screen.getByTestId("logged").props.children).toBe("out");
  });

  it("restaure la session si un token valide est stocké", async () => {
    const SecureStore = require("expo-secure-store");
    SecureStore.getItemAsync.mockResolvedValueOnce("saved");

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 9,
        name: "Restored",
        email: "r@e.com",
        role: "citizen",
      }),
    });

    render(
      <AuthProvider>
        <SignInProbe />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("logged").props.children).toBe("in");
    });

    expect(screen.getByTestId("email").props.children).toBe("r@e.com");
  });

  it("signIn enregistre le token et met à jour l’utilisateur", async () => {
    const user = userEvent.setup();

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      text: async () =>
        JSON.stringify({
          token: "fresh",
          token_type: "Bearer",
          user: { id: 1, name: "N", email: "n@n.com", role: "citizen" },
        }),
    });

    render(
      <AuthProvider>
        <SignInProbe />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByTestId("ready"));

    await user.press(screen.getByTestId("signin"));

    await waitFor(() => {
      expect(screen.getByTestId("logged").props.children).toBe("in");
    });

    expect(screen.getByTestId("email").props.children).toBe("n@n.com");

    const SecureStore = require("expo-secure-store");
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith("rr_sanctum_token", "fresh");
  });

  it("signOut appelle l’API puis efface le stockage", async () => {
    const user = userEvent.setup();
    const SecureStore = require("expo-secure-store");
    SecureStore.getItemAsync.mockResolvedValueOnce("tok");

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 1, name: "A", email: "a@a.com", role: "citizen" }),
      })
      .mockResolvedValueOnce({ ok: true });

    render(
      <AuthProvider>
        <SignInProbe />
      </AuthProvider>,
    );

    await waitFor(() => screen.getByTestId("logged").props.children === "in");

    await user.press(screen.getByTestId("signout"));

    await waitFor(() => {
      expect(screen.getByTestId("logged").props.children).toBe("out");
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/api/logout"),
      expect.objectContaining({ method: "POST" }),
    );
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith("rr_sanctum_token");
  });
});
