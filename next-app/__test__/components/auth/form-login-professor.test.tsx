import FormLoginProfessor from "@/components/auth/form-login-professor";
import useLogin from "@/hooks/mutations/useLogin";
import Providers from "@/lib/providers";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock("@/hooks/mutations/useLogin", () =>
  jest.fn(() => ({
    mutateAsync: jest.fn(),
  }))
);

jest.mock("next/navigation", () => ({
  useSearchParams: jest.fn(() => ({
    get: jest.fn(() => ""),
  })),
}));

jest.mock("@/components/auth/google-signin-button.tsx", () =>
  jest.fn(() => <button> Google Sign </button>)
);

describe("FormLogin", () => {
  beforeEach(() => {
    render(
      <Providers>
        <FormLoginProfessor />
      </Providers>
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Mock de la fonction mutateAsync pour simuler une réponse positive pour le 2FA
  const twoFactorIsTrue = () => {
    const mockMutate = jest.fn().mockResolvedValue({ twoFactor: true });
    (useLogin as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockMutate,
      isPending: false,
    }));
  };

  it("should render FormLogin component correctly", () => {
    expect(screen.getByTestId("form-login-professor")).toBeInTheDocument();
  });

  it("should render FormLogin component with description", () => {
    expect(
      screen.getByText(
        /Entrez votre email et votre mot de passe ci-dessous pour vous connecter/i
      )
    ).toBeInTheDocument();
  });

  it("should render a input of type email", () => {
    expect(
      screen.getByPlaceholderText("exemple@gmail.com")
    ).toBeInTheDocument();
  });

  it("should render a input of type password", () => {
    const passwordInput = screen.getByPlaceholderText("******");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("should render a link with the text 'Mot de passe oublié ?'", () => {
    const link = screen.getByRole("link", { name: /Mot de passe oublié ?/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/auth/reset-password");
  });

  it("should render a button with the text 'Connexion'", () => {
    const SubmitButton = screen.getByRole("button", { name: /Connexion/i });
    expect(SubmitButton).toBeInTheDocument();
    expect(SubmitButton).toHaveAttribute("type", "submit");
  });

  it("renders the social button correctly", () => {
    expect(
      screen.getByRole("button", { name: /Google Sign/i })
    ).toBeInTheDocument();
  });

  it("Should not displayed the two-factor code input if twoFactor is false", () => {
    expect(screen.queryByTestId("two-factor-section")).not.toBeInTheDocument();
  });

  it("should display error messages if the fields are empty", async () => {
    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Adresse email invalide/i)).toBeInTheDocument();
      expect(screen.getByText(/minimum 6 caractère/i)).toBeInTheDocument();
    });
  });

  it("should display error messages if the fields are invalid", async () => {
    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "12345" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Adresse email invalide/i)).toBeInTheDocument();
      expect(screen.getByText(/minimum 6 caractère/i)).toBeInTheDocument();
    });
  });

  it("should submit the form with valid data", async () => {
    const mockMutate = jest.fn(); // Mocker la fonction mutateAsync
    (useLogin as jest.Mock).mockImplementation(() => ({
      mutateAsync: mockMutate, // Simule la résolution avec twoFactor
      isPending: false,
    }));

    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, {
      target: { value: "valid-email@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledTimes(1);
      expect(mockMutate).toHaveBeenCalledWith({
        email: "valid-email@gmail.com",
        password: "123456",
        code: "",
      });
    });
  });

  it("should display the two-factor code input if twoFactor is true", async () => {
    twoFactorIsTrue();

    // Remplir le formulaire avec des données valides
    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, {
      target: { value: "valid-email@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    // Attendre que la section du 2FA apparaisse
    await waitFor(() => {
      expect(screen.getByTestId("two-factor-section")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Veuillez saisir le code à usage unique qui vous a été envoyé par mail./i
        )
      ).toBeInTheDocument();
    });
  });

  it("should not display the email input and the password input if twoFactor is true", async () => {
    twoFactorIsTrue();

    // Remplir le formulaire avec des données valides
    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, {
      target: { value: "valid-email@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    // Attendre que la section du 2FA apparaisse
    await waitFor(() => {
      expect(emailInput).not.toBeInTheDocument();
      expect(passwordInput).not.toBeInTheDocument();
      expect(submitButton).not.toHaveTextContent(/Connexion/i);
    });
  });

  it("The button text must display 'Confirmer' if twoFactor is true", async () => {
    twoFactorIsTrue();

    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, {
      target: { value: "valid-email@gmail.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    // Attendre que la section du 2FA apparaisse
    await waitFor(() => {
      expect(submitButton).toHaveTextContent(/Confirmer/i);
    });
  });

  it("should display the error message if OAuthAccountNotLinked is true", async () => {
    const emailInput = screen.getByPlaceholderText("exemple@gmail.com");
    const passwordInput = screen.getByPlaceholderText("******");
    const submitButton = screen.getByRole("button", { name: /Connexion/i });

    fireEvent.change(emailInput, { target: { value: "invalid-email" } });
    fireEvent.change(passwordInput, { target: { value: "123456" } });
    fireEvent.click(submitButton);

    await waitFor(() => {});
  });
});
