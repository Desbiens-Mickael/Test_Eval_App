import signInProvider from "@/actions/signIn"; // Import direct pour le mock
import GoogleSignInButton from "@/components/auth/google-signin-button";
import { fireEvent, render, screen } from "@testing-library/react";

jest.mock("@/actions/signIn", () => jest.fn()); // Mock la fonction signInProvider

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

  it("should call signInProvider with 'google' when button is clicked", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(signInProvider).toHaveBeenCalledWith("google"); // Vérifie l'appel avec "google"
  });
});
