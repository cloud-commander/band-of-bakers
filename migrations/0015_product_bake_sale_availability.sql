CREATE TABLE IF NOT EXISTS product_bake_sale_availability (
  product_id TEXT NOT NULL,
  bake_sale_id TEXT NOT NULL,
  is_available INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (product_id, bake_sale_id),
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (bake_sale_id) REFERENCES bake_sales(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pbsa_bake_sale_id ON product_bake_sale_availability (bake_sale_id);
