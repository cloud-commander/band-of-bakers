import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "../index";

// Mock next-auth/react
const mockUseSession = vi.fn();
vi.mock("next-auth/react", () => ({
  useSession: () => mockUseSession(),
  signOut: vi.fn(),
}));

// Mock cart context
const mockUseCart = vi.fn();
vi.mock("@/context/cart-context", () => ({
  useCart: () => mockUseCart(),
}));

// Mock mobile menu (since it might have complex dependencies)
vi.mock("@/components/mobile-menu", () => ({
  MobileMenu: () => <div data-testid="mobile-menu">Mobile Menu</div>,
}));

// Mock cart preview
vi.mock("@/components/cart-preview", () => ({
  CartPreview: () => <div data-testid="cart-preview">Cart Preview</div>,
}));

describe("Navbar", () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    mockUseCart.mockReturnValue({ cartCount: 0 });
  });

  it("renders logo", () => {
    render(<Navbar />);
    // Assuming NavbarLogo renders an image with alt text "Band of Bakers" or text
    // Let's check for the text "Band of Bakers" which is likely in the logo component
    // If not, we might need to check for the link to "/"
    const homeLink = screen.getAllByRole("link", { name: /home/i })[0];
    expect(homeLink).toBeInTheDocument();
  });

  it("renders desktop navigation links", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /shop/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /news/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /faq/i })).toBeInTheDocument();
  });

  it("renders login button when unauthenticated", () => {
    mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(<Navbar />);
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /profile/i })).not.toBeInTheDocument();
  });

  it("renders user menu when authenticated", () => {
    mockUseSession.mockReturnValue({
      data: { user: { name: "Test User", email: "test@example.com" } },
      status: "authenticated",
    });
    render(<Navbar />);
    // UserMenu renders a button with a user icon, but maybe no text?
    // It's a dropdown trigger.
    // Let's check that the login button is GONE.
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
    // And check for the user menu trigger (it has a User icon)
    // We can look for the button that opens the menu
    const userButton = screen.getByRole("button", { name: /user menu/i });
    expect(userButton).toBeInTheDocument();
  });

  it("renders admin link when user is admin", () => {
    mockUseSession.mockReturnValue({
      data: { user: { role: "manager" } },
      status: "authenticated",
    });
    render(<Navbar />);
    expect(screen.getByRole("link", { name: /admin/i })).toBeInTheDocument();
  });

  it("does not render admin link when user is customer", () => {
    mockUseSession.mockReturnValue({
      data: { user: { role: "customer" } },
      status: "authenticated",
    });
    render(<Navbar />);
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
  });
});
