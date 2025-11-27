"use server";

import { categoryRepository } from "@/lib/repositories/category.repository";

export async function getCategories() {
  try {
    return await categoryRepository.findAllSorted();
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}
