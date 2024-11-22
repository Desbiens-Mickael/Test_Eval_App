import { logoutAction } from "@/actions/logout.action";
import LogoutButton from "@/components/auth/logout-button";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/actions/logout.action", () => ({
  logoutAction: jest.fn(),
}));

describe("LogoutButton", () => {
  describe("with default props", () => {
    beforeEach(() => {
      render(<LogoutButton />);
    });
    it("should render LogoutButton component correctly", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render LogoutButton component with default text", () => {
      expect(screen.getByText("Déconnexion")).toBeInTheDocument();
    });

    it("should render LogoutButton component with default icon", () => {
      const defaultIcon = screen.getByTestId("logout-icon");
      expect(defaultIcon).toBeInTheDocument();
    });

    it("should render LogoutButton component with default theme", () => {
      expect(screen.getByRole("button")).toHaveClass("bg-secondary text-secondary-foreground hover:bg-secondary/80");
    });

    it("should call logout action when clicked", () => {
      const logoutButton = screen.getByRole("button");
      expect(logoutButton).toBeInTheDocument();
      fireEvent.click(logoutButton);
      expect(logoutAction).toHaveBeenCalled();
    });
  });
  describe("with full props", () => {
    beforeEach(() => {
      render(<LogoutButton text="Logout" icon={<span data-testid="logout-icon-test">👋</span>} theme="outline" />);
    });
    it("should render LogoutButton component correctly", () => {
      expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("should render LogoutButton component with default text", () => {
      expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("must render the LogoutButton component with the custom icon and the default icon must not be displayed", () => {
      const defaultIcon = screen.queryByTestId("logout-icon");
      const customIcon = screen.getByTestId("logout-icon-test");

      expect(defaultIcon).not.toBeInTheDocument();
      expect(customIcon).toBeInTheDocument();
    });

    it("should render LogoutButton component with outline theme", () => {
      expect(screen.getByRole("button")).toHaveClass("border border-input bg-background hover:bg-accent hover:text-accent-foreground");
    });
  });
});
