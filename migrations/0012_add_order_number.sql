ALTER TABLE `orders` ADD COLUMN `order_number` integer;
CREATE UNIQUE INDEX `idx_orders_order_number` ON `orders` (`order_number`);

-- Backfill existing orders with sequential order_number based on created_at then id
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS seq
  FROM orders
)
UPDATE orders
SET order_number = (SELECT seq FROM ordered WHERE ordered.id = orders.id)
WHERE order_number IS NULL;
