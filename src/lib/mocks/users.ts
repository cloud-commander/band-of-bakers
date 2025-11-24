import type { User, PublicUser, UserRole } from "@/lib/validators/user";

// ============================================================================
// USERS - MOCK DATA
// ============================================================================

// Happy path - various user roles
export const mockUsers: User[] = [
  {
    id: "user-owner",
    email: "owner@bandofbakers.co.uk",
    password_hash: "$2a$10$mockhashedpassword1", // Mock bcrypt hash
    name: "Alice Baker",
    phone: "+447700900123",
    role: "owner",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2023-01-01T00:00:00Z").toISOString(),
    updated_at: new Date("2023-01-01T00:00:00Z").toISOString(),
  },
  {
    id: "user-manager",
    email: "manager@bandofbakers.co.uk",
    password_hash: "$2a$10$mockhashedpassword2",
    name: "Bob Manager",
    phone: "+447700900124",
    role: "manager",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2023-02-01T00:00:00Z").toISOString(),
    updated_at: new Date("2023-02-01T00:00:00Z").toISOString(),
  },
  {
    id: "user-staff",
    email: "staff@bandofbakers.co.uk",
    password_hash: "$2a$10$mockhashedpassword3",
    name: "Carol Staff",
    phone: "+447700900125",
    role: "staff",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2023-03-01T00:00:00Z").toISOString(),
    updated_at: new Date("2023-03-01T00:00:00Z").toISOString(),
  },
  {
    id: "user-cust-1",
    email: "john.smith@example.com",
    password_hash: "$2a$10$mockhashedpassword4",
    name: "John Smith",
    phone: "+447700900001",
    role: "customer",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2024-01-15T00:00:00Z").toISOString(),
    updated_at: new Date("2024-01-15T00:00:00Z").toISOString(),
  },
  {
    id: "user-cust-2",
    email: "jane.doe@example.com",
    password_hash: "$2a$10$mockhashedpassword5",
    name: "Jane Doe",
    phone: "+447700900002",
    role: "customer",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2024-02-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-02-01T00:00:00Z").toISOString(),
  },
  {
    id: "user-cust-3",
    email: "sarah.jones@example.com",
    password_hash: "$2a$10$mockhashedpassword6",
    name: "Sarah Jones",
    phone: null, // No phone number
    role: "customer",
    avatar_url: null,
    email_verified: true,
    created_at: new Date("2024-03-01T00:00:00Z").toISOString(),
    updated_at: new Date("2024-03-01T00:00:00Z").toISOString(),
  },
];

// Current user (customer)
export const mockCurrentUser: User = mockUsers[3]; // John Smith

// Owner
export const mockOwner: User = mockUsers[0];

// Manager
export const mockManager: User = mockUsers[1];

// Staff
export const mockStaff: User = mockUsers[2];

// Customers only
export const mockCustomers: User[] = mockUsers.filter((u) => u.role === "customer");

// Public users (without password hash)
export const mockPublicUsers: PublicUser[] = mockUsers.map(({ password_hash, ...user }) => user);

// Empty state
export const mockUsersEmpty: User[] = [];

// Single user
export const mockUsersSingle: User[] = [mockUsers[0]];

// Unverified email user
export const mockUserUnverified: User = {
  id: "user-unverified",
  email: "unverified@example.com",
  password_hash: "$2a$10$mockhashedpassword7",
  name: "Unverified User",
  phone: null,
  role: "customer",
  avatar_url: null,
  email_verified: false,
  created_at: new Date("2024-05-01T00:00:00Z").toISOString(),
  updated_at: new Date("2024-05-01T00:00:00Z").toISOString(),
};

// OAuth user (no password)
export const mockOAuthUser: User = {
  id: "user-oauth",
  email: "google.user@gmail.com",
  password_hash: null, // OAuth-only user
  name: "Google User",
  phone: "+447700900010",
  role: "customer",
  avatar_url: "https://lh3.googleusercontent.com/a/mockavatar",
  email_verified: true,
  created_at: new Date("2024-06-01T00:00:00Z").toISOString(),
  updated_at: new Date("2024-06-01T00:00:00Z").toISOString(),
};

// Long name edge case
export const mockUserLongName: User = {
  id: "user-longname",
  email: "very.long.name@example.com",
  password_hash: "$2a$10$mockhashedpassword8",
  name: "This Is An Extremely Long Name That Might Break The UI Layout If Not Properly Handled With Truncation Or Overflow",
  phone: "+447700900011",
  role: "customer",
  avatar_url: null,
  email_verified: true,
  created_at: new Date("2024-07-01T00:00:00Z").toISOString(),
  updated_at: new Date("2024-07-01T00:00:00Z").toISOString(),
};

// Many users (for pagination)
export const mockUsersMany: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: `user-many-${i}`,
  email: `user${i}@example.com`,
  password_hash: `$2a$10$mockhashedpassword${i}`,
  name: `Customer ${i + 1}`,
  phone: i % 3 === 0 ? `+4477009${String(i).padStart(5, "0")}` : null,
  role: "customer" as UserRole,
  avatar_url: null,
  email_verified: i % 5 !== 0, // Every 5th is unverified
  created_at: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(
    2,
    "0"
  )}T00:00:00.000Z`,
  updated_at: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(
    2,
    "0"
  )}T00:00:00.000Z`,
}));

// Admin users (for RBAC testing)
export const mockAdminUsers: User[] = mockUsers.filter(
  (u) => u.role === "owner" || u.role === "manager" || u.role === "staff"
);
