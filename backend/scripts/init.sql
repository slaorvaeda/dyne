-- Sales & Revenue Analytics schema
-- Schema matches: order_date, product_name, category, region, quantity, price, total_amount

CREATE TABLE IF NOT EXISTS sales (
  id SERIAL PRIMARY KEY,
  order_date DATE NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  region VARCHAR(100),
  quantity INTEGER DEFAULT 1,
  price DECIMAL(12, 2) NOT NULL,
  total_amount DECIMAL(14, 2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sales_order_date ON sales (order_date);
CREATE INDEX IF NOT EXISTS idx_sales_category ON sales (category);
CREATE INDEX IF NOT EXISTS idx_sales_region ON sales (region);
CREATE INDEX IF NOT EXISTS idx_sales_product ON sales (product_name);
