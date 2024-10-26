import Home from "@/app/(public)/page";
import { render, screen } from "@testing-library/react";

describe("Home page component", () => {
  it("should render the Home page component correctly", () => {
    render(<Home />);
    const title = screen.getByRole("heading", { level: 1 });

    expect(title).toBeInTheDocument();
  });

  it("should display a welcome message", () => {
    render(<Home />);
    const title = screen.getByRole("heading", { level: 1 });

    expect(title).toHaveTextContent("Bienvenue sur Test Eval !!!");
  });
});
