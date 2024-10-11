import NotFound from "@/app/not-found";
import { render, screen } from "@testing-library/react";

// Render the NotFound component before each test case
beforeEach(() => {
  render(<NotFound />);
});

describe("NotFound component", () => {
  it("should render a 404 page", () => {
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1).toHaveTextContent("Not Found");
  });

  it("should render an information text", () => {
    const text = screen.getByRole("paragraph");
    expect(text).toBeInTheDocument();
    expect(text).toHaveTextContent("Impossible de trouver la ressource demandée");
  });

  it("should render an image in the 404 page", () => {
    const image = screen.getByAltText("not found");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/assets/images/not-found.png");
  });

  it("should render a link to the home page", () => {
    const link = screen.getByRole("link", { name: "Retour à l'accueil" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(<NotFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});
