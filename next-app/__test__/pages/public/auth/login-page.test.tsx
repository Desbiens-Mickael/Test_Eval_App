import LoginPage from "@/app/(public)/auth/connexion/page";
import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import { render, screen } from "@testing-library/react";

jest.mock("@/components/auth/authentication-wrapper", () =>
  jest.fn(({ children }) => <div>{children}</div>)
);
jest.mock("@/components/auth/form-login-professor", () =>
  jest.fn(() => (
    <div>
      <h1>Mocked FormLoginProfessor Component</h1>
    </div>
  ))
);
jest.mock("@/components/auth/form-login-student", () =>
  jest.fn(() => (
    <div>
      <h1>Mocked FormLoginStudent Component</h1>
    </div>
  ))
);

describe("LoginPage", () => {
  it("renders correctly", () => {
    render(<LoginPage />);

    // Verify if AuthenticationWrapper is called with the expected props
    expect(AuthenticationWrapper).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Connexion",
        imagePath: "/assets/images/login.webp",
        backButtonHref: "/auth/inscription",
        backButtonText: "Pas encore de compte ? CRÉER UN COMPTE",
      }),
      expect.anything()
    );

    // Verify if FormLogin component is rendered using test id
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /Mocked FormLoginProfessor Component/i,
      })
    ).toBeInTheDocument();
  });
});
