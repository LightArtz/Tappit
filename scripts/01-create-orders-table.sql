-- Drop the table if it exists (optional, useful for clean slate)
DROP TABLE IF EXISTS orders;

-- Create orders table for Tappit pre-orders (Revised Structure)
CREATE TABLE IF NOT EXISTS public.orders ( -- Added 'public.' schema qualifier
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL, -- Increased length for flexibility
  nfc_link TEXT NOT NULL,       -- Added nfc_link field, type TEXT for long URLs
  design VARCHAR(100) NOT NULL,
  payment_proof_url TEXT,     -- Renamed photo_url to payment_proof_url, type TEXT
  status VARCHAR(50) DEFAULT 'pending_payment', -- Changed default status
  price INT NOT NULL DEFAULT 25000, -- Added fixed price column, defaulted to 25000 (adjust if needed)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Added timezone
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()  -- Added timezone
);

-- Ensure correct ownership if needed (usually handled by Supabase GUI)
-- ALTER TABLE public.orders OWNER to postgres;
-- GRANT ALL ON TABLE public.orders TO postgres;
-- GRANT ALL ON TABLE public.orders TO service_role;
-- GRANT SELECT, INSERT ON TABLE public.orders TO anon; -- Allow anon insert/select

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_orders_email ON public.orders(email);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Remove existing policies if they exist (run these in Supabase SQL editor if needed)
-- DROP POLICY IF EXISTS "Allow public to insert orders" ON public.orders;
-- DROP POLICY IF EXISTS "Allow users to read own orders" ON public.orders;

-- Allow anyone to insert orders (pre-order form)
CREATE POLICY "Allow public insert on orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Allow anyone to select (optional, adjust RLS as needed for security)
-- If you need users to see their orders later, you'll need auth and different rules.
-- For now, allowing public select might be okay for testing, but NOT recommended for production.
CREATE POLICY "Allow public select on orders" ON public.orders
  FOR SELECT USING (true);

-- Function to update the updated_at column automatically (Optional but recommended)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function before update (Optional but recommended)
DROP TRIGGER IF EXISTS on_orders_updated ON public.orders; -- Drop first if recreating
CREATE TRIGGER on_orders_updated
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();