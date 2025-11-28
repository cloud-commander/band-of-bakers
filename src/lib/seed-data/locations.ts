import type { Location } from "@/lib/validators/bake-sale";

// ============================================================================
// LOCATIONS - MOCK DATA
// ============================================================================

// Happy path - realistic UK locations
export const mockLocations: Location[] = [
  {
    id: "loc-1",
    name: "Station Road, Cressage",
    address_line1: "Station Road",
    address_line2: null,
    city: "Cressage",
    postcode: "SY5 6EP",
    collection_hours: "10:00-16:00",
    is_active: true,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "loc-2",
    name: "Shrewsbury Town Hall",
    address_line1: "The Square",
    address_line2: null,
    city: "Shrewsbury",
    postcode: "SY1 1LH",
    collection_hours: "09:00-17:00",
    is_active: true,
    created_at: "2024-01-15T00:00:00.000Z",
    updated_at: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "loc-3",
    name: "Telford Shopping Centre",
    address_line1: "Telford Town Centre",
    address_line2: "New Street",
    city: "Telford",
    postcode: "TF3 4BX",
    collection_hours: "11:00-19:00",
    is_active: true,
    created_at: "2024-02-01T00:00:00.000Z",
    updated_at: "2024-02-01T00:00:00.000Z",
  },
];

// Default location (Station Road, Cressage)
export const mockDefaultLocation: Location = mockLocations[0];

// Empty state
export const mockLocationsEmpty: Location[] = [];

// Single location
export const mockLocationsSingle: Location[] = [mockLocations[0]];

// Inactive location
export const mockLocationInactive: Location = {
  id: "loc-inactive",
  name: "Old Location (Closed)",
  address_line1: "123 Old Street",
  address_line2: null,
  city: "Oldtown",
  postcode: "SY1 1AA",
  collection_hours: null,
  is_active: false,
  created_at: "2023-01-01T00:00:00.000Z",
  updated_at: "2024-06-01T00:00:00.000Z",
};

// Long name edge case
export const mockLocationLongName: Location = {
  id: "loc-long",
  name: "This is an extremely long location name that might break the UI layout if not handled properly with truncation or responsive design patterns",
  address_line1: "Very Long Street Name That Goes On And On",
  address_line2: "Building Complex With A Very Long Name",
  city: "Verylongcityname",
  postcode: "VL1 2LN",
  collection_hours: "00:00-23:59",
  is_active: true,
  created_at: "2024-03-01T00:00:00.000Z",
  updated_at: "2024-03-01T00:00:00.000Z",
};

// Many locations (for testing pagination/scrolling)
export const mockLocationsMany: Location[] = Array.from({ length: 25 }, (_, i) => ({
  id: `loc-many-${i}`,
  name: `Location ${i + 1}`,
  address_line1: `${i + 1} Test Street`,
  address_line2: i % 3 === 0 ? `Floor ${i}` : null,
  city: i % 2 === 0 ? "Birmingham" : "Manchester",
  postcode: `B${i + 1} ${i}XX`,
  collection_hours: `${(i % 12) + 8}:00-${(i % 12) + 17}:00`,
  is_active: i % 5 !== 0, // Every 5th is inactive
  created_at: `2024-01-${String((i % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
  updated_at: `2024-01-${String((i % 28) + 1).padStart(2, "0")}T00:00:00.000Z`,
}));
