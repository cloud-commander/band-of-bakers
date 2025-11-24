import type { BakeSale, BakeSaleWithLocation } from "@/lib/validators/bake-sale";
import { mockLocations, mockDefaultLocation } from "./locations";

// ============================================================================
// BAKE SALES - MOCK DATA
// ============================================================================

// Happy path - upcoming bake sales
export const mockBakeSales: BakeSale[] = [
  {
    id: "bs-1",
    date: "2024-12-08", // 1 week from Dec 1
    location_id: mockLocations[0].id, // Station Road, Cressage
    cutoff_datetime: "2024-12-06T18:00:00.000Z", // 2 days before at 6pm
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-2",
    date: "2024-12-15", // 2 weeks from Dec 1
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-12-13T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-3",
    date: "2024-12-22", // 3 weeks from Dec 1
    location_id: mockLocations[1].id, // Shrewsbury Town Hall
    cutoff_datetime: "2024-12-20T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-4",
    date: "2024-12-29", // 4 weeks from Dec 1
    location_id: mockLocations[2].id, // Telford Shopping Centre
    cutoff_datetime: "2024-12-27T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-5",
    date: "2025-01-05", // 5 weeks from Dec 1
    location_id: mockLocations[0].id,
    cutoff_datetime: "2025-01-03T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// Bake sales with location data (for UI display)
export const mockBakeSalesWithLocation: BakeSaleWithLocation[] = mockBakeSales.map((bakeSale) => ({
  ...bakeSale,
  location: mockLocations.find((loc) => loc.id === bakeSale.location_id)!,
}));

// Nearest upcoming bake sale (first in list)
export const mockNextBakeSale: BakeSale = mockBakeSales[0];

// Empty state
export const mockBakeSalesEmpty: BakeSale[] = [];

// Single bake sale
export const mockBakeSalesSingle: BakeSale[] = [mockBakeSales[0]];

// Past bake sale (for history)
export const mockBakeSalePast: BakeSale = {
  id: "bs-past",
  date: "2024-01-15",
  location_id: mockDefaultLocation.id,
  cutoff_datetime: "2024-01-13T18:00:00.000Z",
  is_active: false,
  created_at: "2023-12-01T00:00:00.000Z",
  updated_at: "2024-01-15T00:00:00.000Z",
};

// Cutoff passed (can't order anymore)
export const mockBakeSaleCutoffPassed: BakeSale = {
  id: "bs-cutoff",
  date: "2024-12-03",
  location_id: mockDefaultLocation.id,
  cutoff_datetime: "2024-11-23T18:00:00.000Z", // Fixed past date
  is_active: true,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-01-01T00:00:00.000Z",
};

// Inactive bake sale
export const mockBakeSaleInactive: BakeSale = {
  id: "bs-inactive",
  date: "2024-12-11",
  location_id: mockDefaultLocation.id,
  cutoff_datetime: "2024-12-09T18:00:00.000Z",
  is_active: false,
  created_at: "2024-01-01T00:00:00.000Z",
  updated_at: "2024-03-01T00:00:00.000Z",
};

// Many bake sales (for pagination) - static data
export const mockBakeSalesMany: BakeSale[] = [
  {
    id: "bs-many-0",
    date: "2024-12-08",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-12-06T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-1",
    date: "2024-12-15",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2024-12-13T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-2",
    date: "2024-12-22",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2024-12-20T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-3",
    date: "2024-12-29",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2024-12-27T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-4",
    date: "2025-01-05",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2025-01-03T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-5",
    date: "2025-01-12",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2025-01-10T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-6",
    date: "2025-01-19",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2025-01-17T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-7",
    date: "2025-01-26",
    location_id: mockLocations[1].id,
    cutoff_datetime: "2025-01-24T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-8",
    date: "2025-02-02",
    location_id: mockLocations[2].id,
    cutoff_datetime: "2025-01-31T18:00:00.000Z",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "bs-many-9",
    date: "2025-02-09",
    location_id: mockLocations[0].id,
    cutoff_datetime: "2025-02-07T18:00:00.000Z",
    is_active: false,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
];

// Christmas period bake sale (exception to monthly schedule)
export const mockBakeSaleChristmas: BakeSale = {
  id: "bs-christmas",
  date: "2024-12-21",
  location_id: mockDefaultLocation.id,
  cutoff_datetime: "2024-12-19T18:00:00.000Z",
  is_active: true,
  created_at: "2024-11-01T00:00:00.000Z",
  updated_at: "2024-11-01T00:00:00.000Z",
};
