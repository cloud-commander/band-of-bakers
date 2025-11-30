-- Ensure order_number is populated for any rows that might still be null
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS seq
  FROM orders
  WHERE order_number IS NULL
)
UPDATE orders
SET order_number = (SELECT seq FROM ordered WHERE ordered.id = orders.id)
WHERE order_number IS NULL;

-- Enforce NOT NULL via table rebuild (SQLite)
CREATE TABLE orders_new AS
SELECT
  id,
  user_id,
  bake_sale_id,
  status,
  fulfillment_method,
  payment_method,
  payment_status,
  payment_intent_id,
  subtotal,
  delivery_fee,
  voucher_discount,
  total,
  shipping_address_line1,
  shipping_address_line2,
  shipping_city,
  shipping_postcode,
  billing_address_line1,
  billing_address_line2,
  billing_city,
  billing_postcode,
  voucher_id,
  notes,
  created_at,
  updated_at,
  order_number
FROM orders;

DROP TABLE orders;
ALTER TABLE orders_new RENAME TO orders;

CREATE UNIQUE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
