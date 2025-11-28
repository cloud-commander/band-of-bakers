import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  ProductCardSkeleton,
  ProductGridSkeleton,
  OrderCardSkeleton,
  TableSkeleton,
  FormSkeleton,
  PageHeaderSkeleton,
  NewsCardSkeleton,
  StatsCardSkeleton,
  GallerySkeleton,
  ProfileSkeleton,
} from "../loading-skeletons";

describe("Loading Skeletons", () => {
  it("ProductCardSkeleton renders correctly", () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("ProductGridSkeleton renders correctly", () => {
    const { container } = render(<ProductGridSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
    // Should render 6 items by default
    expect(container.querySelectorAll(".overflow-hidden")).toHaveLength(6);
  });

  it("ProductGridSkeleton respects count prop", () => {
    const { container } = render(<ProductGridSkeleton count={3} />);
    expect(container.querySelectorAll(".overflow-hidden")).toHaveLength(3);
  });

  it("OrderCardSkeleton renders correctly", () => {
    const { container } = render(<OrderCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("TableSkeleton renders correctly", () => {
    const { container } = render(<TableSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("TableSkeleton respects rows and cols props", () => {
    const { container } = render(<TableSkeleton rows={3} cols={2} />);
    // 1 header row + 3 data rows = 4 rows total
    // But the implementation uses separate header and rows containers
    // Header has 2 cols
    // Each row has 2 cols
    // The implementation:
    // <div className="flex gap-4 pb-3 border-b"> {cols} </div>
    // {rows} * <div className="flex gap-4 py-3"> {cols} </div>

    // Check rows (excluding header)
    const dataRows = container.querySelectorAll(".py-3");
    expect(dataRows).toHaveLength(3);
  });

  it("FormSkeleton renders correctly", () => {
    const { container } = render(<FormSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("PageHeaderSkeleton renders correctly", () => {
    const { container } = render(<PageHeaderSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("NewsCardSkeleton renders correctly", () => {
    const { container } = render(<NewsCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("StatsCardSkeleton renders correctly", () => {
    const { container } = render(<StatsCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("GallerySkeleton renders correctly", () => {
    const { container } = render(<GallerySkeleton />);
    expect(container.firstChild).toBeInTheDocument();
    // Default count is 12
    expect(container.querySelectorAll(".aspect-square")).toHaveLength(12);
  });

  it("ProfileSkeleton renders correctly", () => {
    const { container } = render(<ProfileSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
