"use server";

import { userRepository } from "@/lib/repositories/user.repository";
import { auth } from "@/auth";

export async function getUsers() {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await userRepository.findAll();
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function getUserById(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.role || !["owner", "manager"].includes(session.user.role)) {
      throw new Error("Unauthorized");
    }
    return await userRepository.findById(id);
  } catch (error) {
    console.error(`Failed to fetch user ${id}:`, error);
    return null;
  }
}

export async function getPaginatedUsers(page = 1, pageSize = 20) {
  const limit = Math.max(1, Math.min(pageSize, 100));
  const currentPage = Math.max(1, page);
  const offset = (currentPage - 1) * limit;

  const result = await userRepository.findPaginated(limit, offset);
  return {
    users: result.data,
    total: result.total,
    page: currentPage,
    pageSize: limit,
  };
}
