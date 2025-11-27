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
