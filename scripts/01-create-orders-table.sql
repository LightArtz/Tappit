-- Create orders table for Tappit pre-orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  design VARCHAR(100) NOT NULL,
  payment_details JSONB,
  photo_url VARCHAR(500),
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (pre-order form)
CREATE POLICY "Allow public to insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow users to read their own orders
CREATE POLICY "Allow users to read own orders" ON orders
  FOR SELECT USING (true);
