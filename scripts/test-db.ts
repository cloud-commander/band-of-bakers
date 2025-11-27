import { getOrders } from "../src/actions/orders";

async function main() {
  console.log("Attempting to fetch orders...");
  try {
    const orders = await getOrders();
    console.log(`Successfully fetched ${orders.length} orders.`);
    if (orders.length > 0) {
      console.log("First order sample:", JSON.stringify(orders[0], null, 2));
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
}

main();
