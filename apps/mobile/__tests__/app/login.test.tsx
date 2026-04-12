import LoginScreen from "@/app/login";
import { render, screen, userEvent, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();

jest.mock("@/contexts/AuthContext", () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
}));

jest.mock("@/contexts/FooterScrollContext", () => ({
  useFooterScroll: () => ({
    scrollHandler: jest.fn(),
    contentInsetBottom: 24,
  }),
}));

jest.mock("expo-router", () => ({
  router: { back: jest.fn(), push: jest.fn(), replace: jest.fn() },
}));

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("appelle signIn avec e-mail et mot de passe", async () => {
    mockSignIn.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.type(screen.getByPlaceholderText("exemple@example.com"), "user@test.fr");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.press(screen.getByLabelText("Se connecter"));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith("user@test.fr", "password123");
    });
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("affiche l’erreur renvoyée par signIn", async () => {
    mockSignIn.mockRejectedValueOnce(new Error("E-mail ou mot de passe incorrect."));
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.type(screen.getByPlaceholderText("exemple@example.com"), "bad@x.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.press(screen.getByLabelText("Se connecter"));

    await waitFor(() => {
      expect(
        screen.getByText("E-mail ou mot de passe incorrect."),
      ).toBeTruthy();
    });
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("ouvre le 404 depuis le lien mot de passe oublié", async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.press(screen.getByLabelText("Mot de passe oublié"));

    expect(router.push).toHaveBeenCalledWith("/404-demo");
  });

  it("passe en mode inscription et appelle signUp", async () => {
    mockSignUp.mockResolvedValueOnce(undefined);
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.press(screen.getByLabelText("Passer en inscription"));

    expect(screen.getByText("Inscription")).toBeTruthy();

    await user.type(screen.getByPlaceholderText("Prénom Nom"), "Jean Test");
    await user.type(screen.getByPlaceholderText("exemple@example.com"), "j@t.fr");
    const pwdFields = screen.getAllByPlaceholderText("••••••••");
    await user.type(pwdFields[0], "Password12");
    await user.type(pwdFields[1], "Password12");
    await user.press(screen.getByLabelText("S’inscrire"));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith("Jean Test", "j@t.fr", "Password12");
    });
    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });

  it("refuse l’inscription si les mots de passe ne correspondent pas", async () => {
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.press(screen.getByLabelText("Passer en inscription"));
    await user.type(screen.getByPlaceholderText("Prénom Nom"), "Jean Test");
    await user.type(screen.getByPlaceholderText("exemple@example.com"), "j@t.fr");
    const pwdFields = screen.getAllByPlaceholderText("••••••••");
    await user.type(pwdFields[0], "Password12");
    await user.type(pwdFields[1], "Password99");
    await user.press(screen.getByLabelText("S’inscrire"));

    expect(
      await screen.findByText("Les mots de passe ne correspondent pas."),
    ).toBeTruthy();
    expect(mockSignUp).not.toHaveBeenCalled();
  });

  it("affiche l’erreur si l’e-mail est déjà utilisé", async () => {
    mockSignUp.mockRejectedValueOnce(new Error("Cet e-mail est déjà utilisé."));
    const user = userEvent.setup();

    render(<LoginScreen />);

    await user.press(screen.getByLabelText("Passer en inscription"));
    await user.type(screen.getByPlaceholderText("Prénom Nom"), "Jean Dup");
    await user.type(screen.getByPlaceholderText("exemple@example.com"), "pris@x.fr");
    const pwdFields = screen.getAllByPlaceholderText("••••••••");
    await user.type(pwdFields[0], "Password12");
    await user.type(pwdFields[1], "Password12");
    await user.press(screen.getByLabelText("S’inscrire"));

    await waitFor(() => {
      expect(screen.getByText("Cet e-mail est déjà utilisé.")).toBeTruthy();
    });
  });
});
