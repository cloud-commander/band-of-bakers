import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "../input";

describe("Input", () => {
  it("renders correctly", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("handles value changes", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="test" />);
    const input = screen.getByPlaceholderText("test");
    fireEvent.change(input, { target: { value: "new value" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("new value");
  });

  it("can be disabled", () => {
    render(<Input disabled placeholder="disabled" />);
    expect(screen.getByPlaceholderText("disabled")).toBeDisabled();
  });

  it("renders with custom type", () => {
    render(<Input type="password" placeholder="password" />);
    expect(screen.getByPlaceholderText("password")).toHaveAttribute("type", "password");
  });

  it("applies custom classes", () => {
    render(<Input className="custom-class" placeholder="custom" />);
    expect(screen.getByPlaceholderText("custom")).toHaveClass("custom-class");
  });
});
