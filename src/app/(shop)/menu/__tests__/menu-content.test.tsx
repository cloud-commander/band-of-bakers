import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MenuContent } from "../menu-content";
import { useSearchParams } from "next/navigation";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  usePathname: () => "/menu",
  useSearchParams: vi.fn(),
}));

vi.mock("@/context/cart-context", () => ({
  useCart: () => ({
    addItem: vi.fn(),
  }),
}));

vi.mock("@/components/state/page-header", () => ({
  PageHeader: () => <div data-testid="page-header">Page Header</div>,
}));

vi.mock("@/components/ui/pagination", () => ({
  Pagination: () => <div data-testid="pagination">Pagination</div>,
  PaginationInfo: () => <div data-testid="pagination-info">Pagination Info</div>,
}));

vi.mock("@/components/search-bar", () => ({
  SearchBar: () => <div data-testid="search-bar">Search Bar</div>,
}));

describe("MenuContent", () => {
  const mockProducts = [
    {
      id: "p1",
      name: "Product 1",
      slug: "product-1",
      category_id: "c1",
      base_price: 10,
      description: "Description 1",
      is_active: true,
      variants: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sort_order: 0,
      image_url: null,
      stock_quantity: 10,
    },
    {
      id: "p2",
      name: "Product 2",
      slug: "product-2",
      category_id: "c1",
      base_price: 20,
      description: "Description 2",
      is_active: true,
      variants: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sort_order: 0,
      image_url: null,
      stock_quantity: 10,
    },
  ];

  const mockCategories = [
    {
      id: "c1",
      name: "Category 1",
      slug: "category-1",
      description: "Desc 1",
      sort_order: 0,
      image_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  const mockBakeSales = [
    {
      id: "bs1",
      date: new Date().toISOString(),
      location_id: "l1",
      is_active: true,
      cutoff_time: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      location: {
        id: "l1",
        name: "Location 1",
        address: "Address 1",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    },
  ];

  it("should display all products when no bake sale is selected (or default) and no unavailability map", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams());
    render(
      <MenuContent
        initialProducts={mockProducts}
        categories={mockCategories}
        upcomingBakeSales={mockBakeSales}
        unavailableProductsMap={{}}
      />
    );

    expect(screen.getByText("Product 1")).toBeDefined();
    expect(screen.getByText("Product 2")).toBeDefined();
  });

  it("should filter out unavailable products for the selected bake sale", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("bakeSale=bs1"));
    const unavailableMap = {
      bs1: ["p1"],
    };

    render(
      <MenuContent
        initialProducts={mockProducts}
        categories={mockCategories}
        upcomingBakeSales={mockBakeSales}
        unavailableProductsMap={unavailableMap}
      />
    );

    expect(screen.queryByText("Product 1")).toBeNull();
    expect(screen.getByText("Product 2")).toBeDefined();
  });

  it("should show unavailable products if they are available for a different bake sale", () => {
    (useSearchParams as any).mockReturnValue(new URLSearchParams("bakeSale=bs1"));
    const unavailableMap = {
      bs2: ["p1"], // p1 is unavailable for bs2, but we are viewing bs1
    };

    render(
      <MenuContent
        initialProducts={mockProducts}
        categories={mockCategories}
        upcomingBakeSales={mockBakeSales}
        unavailableProductsMap={unavailableMap}
      />
    );

    expect(screen.getByText("Product 1")).toBeDefined();
    expect(screen.getByText("Product 2")).toBeDefined();
  });
});
