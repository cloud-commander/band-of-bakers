import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ImageGallery } from "./image-gallery";

// Mock fetch
global.fetch = vi.fn();

describe("ImageGallery", () => {
  const mockImages = Array.from({ length: 12 }, (_, i) => ({
    id: `img-${i}`,
    url: `/images/img${i + 1}.jpg`,
    filename: `img${i + 1}.jpg`,
  }));

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ data: mockImages }),
    });
  });

  it("should render and fetch images", async () => {
    render(<ImageGallery onImageSelect={() => {}} />);

    // Check loading state
    expect(screen.getByText("Loading images...")).toBeInTheDocument();

    // Wait for images to load
    await waitFor(() => {
      expect(screen.queryByText("Loading images...")).not.toBeInTheDocument();
    });

    // Should show first page of images (default desktop size is 8)
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(8);
  });

  it("should handle pagination", async () => {
    render(<ImageGallery onImageSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading images...")).not.toBeInTheDocument();
    });

    // Check pagination controls
    const nextButton = screen.getByLabelText("Go to next page");
    expect(nextButton).toBeInTheDocument();

    // Go to next page
    fireEvent.click(nextButton);

    // Should show remaining images (12 total - 8 on first page = 4 on second)
    const images = screen.getAllByRole("img");
    expect(images.length).toBe(4);
  });

  it("should handle image selection in picker mode", async () => {
    const onSelect = vi.fn();
    render(<ImageGallery onImageSelect={onSelect} mode="picker" />);

    await waitFor(() => {
      expect(screen.queryByText("Loading images...")).not.toBeInTheDocument();
    });

    // Click first image
    // The images are buttons.
    // Or just click the image itself (parent button)
    const images = screen.getAllByRole("img");
    const firstImage = images[0];
    const button = firstImage.closest("button");

    if (button) {
      fireEvent.click(button);
      expect(onSelect).toHaveBeenCalledWith(mockImages[0].url);
    } else {
      throw new Error("Image button not found");
    }
  });

  it("should filter by category", async () => {
    render(<ImageGallery onImageSelect={() => {}} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading images...")).not.toBeInTheDocument();
    });

    const filterSelect = screen.getByLabelText("Filter:");
    fireEvent.change(filterSelect, { target: { value: "cat-breads" } });

    // Should trigger new fetch with category
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining("category=cat-breads"));
  });
});
