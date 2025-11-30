-- Ensure order_number is populated for any rows that might still be null
PRAGMA foreign_keys=OFF;
--> statement-breakpoint

WITH max_order AS (
  SELECT COALESCE(MAX(order_number), 0) AS max_order_number FROM orders
),
ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at, id) AS seq
  FROM orders
  WHERE order_number IS NULL
)
UPDATE orders
SET order_number = (
  SELECT seq + max_order.max_order_number
  FROM ordered
  CROSS JOIN max_order
  WHERE ordered.id = orders.id
)
WHERE order_number IS NULL;
--> statement-breakpoint

CREATE TABLE orders_new (
  id text PRIMARY KEY NOT NULL,
  order_number integer NOT NULL,
  user_id text NOT NULL,
  bake_sale_id text NOT NULL,
  status text DEFAULT 'pending' NOT NULL,
  fulfillment_method text DEFAULT 'collection' NOT NULL,
  payment_method text DEFAULT 'payment_on_collection' NOT NULL,
  payment_status text DEFAULT 'pending' NOT NULL,
  payment_intent_id text,
  subtotal real NOT NULL,
  delivery_fee real DEFAULT 0 NOT NULL,
  voucher_discount real DEFAULT 0 NOT NULL,
  total real NOT NULL,
  shipping_address_line1 text,
  shipping_address_line2 text,
  shipping_city text,
  shipping_postcode text,
  billing_address_line1 text NOT NULL,
  billing_address_line2 text,
  billing_city text NOT NULL,
  billing_postcode text NOT NULL,
  voucher_id text,
  notes text,
  created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (bake_sale_id) REFERENCES bake_sales(id) ON UPDATE no action ON DELETE no action,
  FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint

INSERT INTO orders_new (
  id,
  order_number,
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
  updated_at
)
SELECT
  id,
  order_number,
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
  updated_at
FROM orders;
--> statement-breakpoint

DROP TABLE orders;
--> statement-breakpoint
ALTER TABLE orders_new RENAME TO orders;
--> statement-breakpoint

CREATE UNIQUE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_user_id ON orders (user_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_created_at ON orders (created_at);
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);
--> statement-breakpoint

PRAGMA foreign_keys=ON;
