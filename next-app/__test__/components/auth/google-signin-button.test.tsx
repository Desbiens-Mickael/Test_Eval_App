import signInAction from "@/actions/signIn.action"; // Import direct pour le mock
import GoogleSignInButton from "@/components/auth/google-signin-button";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/actions/signIn.action", () => jest.fn()); // Mock la fonction signInAction

beforeEach(() => {
  render(<GoogleSignInButton />);
});

describe("GoogleSignInButton", () => {
  it("should render", () => {
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should display the Google image", () => {
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/assets/images/google.svg");
  });

  it("should call signInAction with 'google' when button is clicked", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(signInAction).toHaveBeenCalledWith("google"); // Vérifie l'appel avec "google"
  });
});
