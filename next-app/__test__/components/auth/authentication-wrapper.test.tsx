import AuthenticationWrapper from "@/components/auth/authentication-wrapper";
import { render, screen } from "@testing-library/react";

describe("AuthenticationWrapper component", () => {
  describe("With sociale is true", () => {
    beforeEach(() => {
      render(
        <AuthenticationWrapper
          title="title"
          texte="texte"
          imagePath="/assets/images/register-test.webp"
          backButtonText="backButtonText"
          backButtonHref="/auth/inscription"
          backButtonIcon={<div data-testid="icon">icon</div>}
          sociale={true}
        >
          <span data-testid="children">Mocked children</span>
        </AuthenticationWrapper>
      );
    });

    it("renders the heading correctly", () => {
      expect(
        screen.getByRole("heading", { name: /title/i })
      ).toBeInTheDocument();
    });

    it("renders the text correctly", () => {
      expect(screen.getByText(/texte/i)).toBeInTheDocument();
    });

    it("renders the image correctly", () => {
      const image = screen.getByRole("img", { name: /register/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/assets/images/register-test.webp");
    });

    it("renders the icon correctly", () => {
      const icon = screen.getByTestId("icon");
      expect(icon).toBeInTheDocument();
    });

    it("renders the back button correctly", () => {
      const backButton = screen.getByRole("link", { name: /backButtonText/i });
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute("href", "/auth/inscription");
    });

    it("renders children correctly", () => {
      expect(screen.getByTestId("children")).toBeInTheDocument();
    });
  });

  describe("With sociale is false and without compulsory accessories", () => {
    beforeEach(() => {
      render(
        <AuthenticationWrapper
          title="title"
          backButtonText="backButtonText"
          backButtonHref="/auth/inscription"
          sociale={false}
        >
          <span data-testid="children">Mocked children</span>
        </AuthenticationWrapper>
      );
    });
    it("does not render the social button", () => {
      expect(
        screen.queryByRole("button", { name: /Google Sign/i })
      ).not.toBeInTheDocument();
    });

    it("does not render the text", () => {
      expect(screen.queryByText(/texte/i)).not.toBeInTheDocument();
    });

    it("renders the image with the image by default", () => {
      const image = screen.getByRole("img", { name: /register/i });
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute("src", "/assets/images/register.webp");
    });

    it("does not render the icon", () => {
      expect(screen.queryByTestId("icon")).not.toBeInTheDocument();
    });
  });
});
