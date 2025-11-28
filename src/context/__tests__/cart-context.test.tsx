import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import { CartProvider, useCart } from "../cart-context";

// Test component to consume the context
function TestComponent() {
  const { items, addItem, removeItem, updateQuantity, clearCart, cartTotal, cartCount } = useCart();

  return (
    <div>
      <div data-testid="cart-count">{cartCount}</div>
      <div data-testid="cart-total">{cartTotal}</div>
      <div data-testid="items-count">{items.length}</div>
      <button
        onClick={() =>
          addItem({
            productId: "p1",
            name: "Product 1",
            price: 10,
            quantity: 1,
          })
        }
      >
        Add Item
      </button>
      <button
        onClick={() =>
          addItem({
            productId: "p1",
            name: "Product 1",
            price: 10,
            quantity: 2,
          })
        }
      >
        Add More Item
      </button>
      <button onClick={() => removeItem("p1")}>Remove Item</button>
      <button onClick={() => updateQuantity("p1", undefined, 5)}>Update Quantity</button>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
}

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("provides initial empty state", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // Wait for initialization (setTimeout in useEffect)
    await act(async () => {
      vi.runAllTimers();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("0");
    expect(screen.getByTestId("items-count")).toHaveTextContent("0");
  });

  it("adds items to cart", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("1");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("10");
    expect(screen.getByTestId("items-count")).toHaveTextContent("1");
  });

  it("updates quantity for existing items", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    await act(async () => {
      screen.getByText("Add More Item").click();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("3"); // 1 + 2
    expect(screen.getByTestId("cart-total")).toHaveTextContent("30"); // 3 * 10
    expect(screen.getByTestId("items-count")).toHaveTextContent("1"); // Still 1 unique item
  });

  it("removes items from cart", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    await act(async () => {
      screen.getByText("Remove Item").click();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByTestId("items-count")).toHaveTextContent("0");
  });

  it("updates item quantity", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    await act(async () => {
      screen.getByText("Update Quantity").click();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("5");
    expect(screen.getByTestId("cart-total")).toHaveTextContent("50");
  });

  it("clears cart", async () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    await act(async () => {
      screen.getByText("Clear Cart").click();
    });

    expect(screen.getByTestId("cart-count")).toHaveTextContent("0");
    expect(screen.getByTestId("items-count")).toHaveTextContent("0");
  });

  it("persists to localStorage", async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      vi.runAllTimers();
    });

    await act(async () => {
      screen.getByText("Add Item").click();
    });

    // Wait for the useEffect to trigger (it depends on items state change)
    // The useEffect runs after render, so we might need another cycle or just check if it was called
    // Since we are using fake timers, we might need to advance them if there was a debounce (there isn't in the code, but good practice)

    expect(setItemSpy).toHaveBeenCalledWith(
      "bandofbakers-cart",
      expect.stringContaining('"productId":"p1"')
    );
  });
});
