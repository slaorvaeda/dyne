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

-- Product Ratings & Review Analytics (Dataset.xlsx format)
CREATE TABLE IF NOT EXISTS product_reviews (
  id SERIAL PRIMARY KEY,
  product_id VARCHAR(100),
  product_name VARCHAR(500) NOT NULL,
  category VARCHAR(200),
  discounted_price DECIMAL(12, 2),
  actual_price DECIMAL(12, 2),
  discount_percentage DECIMAL(8, 4),
  rating DECIMAL(4, 2),
  rating_count INTEGER,
  about_product TEXT,
  user_name TEXT,
  review_title TEXT,
  review_content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_category ON product_reviews (category);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews (rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_name ON product_reviews (product_name);
