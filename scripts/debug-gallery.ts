import { getCachedImages } from "@/lib/cache";

async function main() {
  console.log("Debugging Gallery Pagination...");

  // Page 1
  console.log("Fetching Page 1...");
  const page1 = await getCachedImages(undefined, undefined, 8, 0, "products");
  console.log(`Page 1: ${page1.images.length} images`);
  const ids1 = new Set(page1.images.map((i) => i.id));

  // Page 2
  console.log("Fetching Page 2...");
  const page2 = await getCachedImages(undefined, undefined, 8, 8, "products");
  console.log(`Page 2: ${page2.images.length} images`);
  const ids2 = new Set(page2.images.map((i) => i.id));

  // Check for duplicates
  const duplicates = page1.images.filter((i) => ids2.has(i.id));

  if (duplicates.length > 0) {
    console.error("❌ Found duplicates between Page 1 and Page 2:");
    duplicates.forEach((d) => console.log(`- ${d.id} (${d.filename})`));
  } else {
    console.log("✅ No duplicates found between Page 1 and Page 2.");
  }

  // Check sort order of Page 1
  console.log("Checking sort order of Page 1...");
  let sorted = true;
  for (let i = 0; i < page1.images.length - 1; i++) {
    const curr = page1.images[i];
    const next = page1.images[i + 1];

    // Compare created_at (desc)
    if (curr.created_at < next.created_at) {
      console.error(
        `❌ Sort order violation at index ${i}: ${curr.created_at} < ${next.created_at}`
      );
      sorted = false;
    } else if (curr.created_at === next.created_at) {
      // Compare id (desc)
      if (curr.id < next.id) {
        console.error(`❌ Sort order violation (ID) at index ${i}: ${curr.id} < ${next.id}`);
        sorted = false;
      }
    }
  }
  if (sorted) console.log("✅ Sort order is correct.");
}

main().catch(console.error);
