import AuthErrorPage from "@/app/(public)/auth/error/page";
import { render, screen } from "@testing-library/react";

describe("AuthErrorPage component", () => {
  beforeEach(() => {
    render(<AuthErrorPage />);
  });

  it("should render the AuthErrorPage component correctly", () => {
    const title = screen.getByRole("heading", { level: 3 });

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Une erreur c'est produite!");
  });

  it("should display an error message", () => {
    const message = screen.getByRole("paragraph");

    expect(message).toBeInTheDocument();
    expect(message).toHaveTextContent("Oops il s'emblerait qu'une erreur c'est produite!");
  });
});
