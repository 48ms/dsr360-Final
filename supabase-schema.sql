-- ==============================================================================
-- DSR360 — Supabase PostgreSQL Database Schema V1
-- B2B Sales Visit & Customer Management System (Shell Lubricants)
-- ==============================================================================

-- Enable essential extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ==============================================================================
-- 1. ENUM TYPES
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('DSR', 'SPV', 'MANAGER', 'ADMIN');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE customer_segment AS ENUM (
    'FLEET', 'TRANSPORT', 'MANUFACTURING', 'CONSTRUCTION', 'MINING',
    'WORKSHOP', 'DISTRIBUTOR', 'RESELLER', 'AGRICULTURE', 'MARINE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE customer_status AS ENUM ('PROSPECT', 'ACTIVE', 'DORMANT', 'INACTIVE', 'LOST');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE customer_priority AS ENUM ('A', 'B', 'C');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE contact_type AS ENUM (
    'PURCHASING', 'MAINTENANCE', 'USER', 'OWNER', 'MANAGER', 'FINANCE', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE influence_level AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE decision_power AS ENUM ('NONE', 'INFLUENCER', 'DECISION_MAKER');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE customer_product_status AS ENUM ('CURRENT', 'TRIAL', 'PROPOSED', 'REJECTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE visit_type AS ENUM (
    'PROSPECTING', 'FOLLOW_UP', 'ROUTINE', 'PRESENTATION', 'TRIAL',
    'NEGOTIATION', 'COMPLAINT', 'TECHNICAL', 'COLLECTION', 'RELATIONSHIP'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE visit_status AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE customer_response AS ENUM ('INTERESTED', 'CONSIDERING', 'NEUTRAL', 'NOT_INTERESTED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE photo_type AS ENUM (
    'CUSTOMER', 'EQUIPMENT', 'EXISTING_PRODUCT', 'NAMEPLATE', 'WORKSHOP', 'DOCUMENT', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_stage AS ENUM (
    'PROSPECT', 'QUALIFIED', 'PRESENTATION', 'TRIAL', 'QUOTATION', 'NEGOTIATION', 'WON', 'LOST'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE follow_up_activity_type AS ENUM (
    'CALL', 'WHATSAPP', 'EMAIL', 'VISIT', 'SEND_QUOTATION', 'SEND_SAMPLE',
    'TRIAL_FOLLOWUP', 'TECHNICAL_FOLLOWUP', 'COLLECTION', 'OTHER'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE follow_up_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE follow_up_status AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- 1. Profiles (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role public.user_role NOT NULL DEFAULT 'DSR',
  sales_area TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Customers
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  segment public.customer_segment NOT NULL DEFAULT 'FLEET',
  industry TEXT,
  address TEXT,
  city TEXT,
  province TEXT,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  status public.customer_status NOT NULL DEFAULT 'PROSPECT',
  priority public.customer_priority NOT NULL DEFAULT 'B',
  estimated_monthly_volume NUMERIC(12, 2),
  potential_monthly_volume NUMERIC(12, 2),
  payment_term_days INTEGER,
  notes TEXT,
  owner_id UUID NOT NULL REFERENCES public.profiles(id),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Customer Contacts (PIC)
CREATE TABLE IF NOT EXISTS public.customer_contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  phone TEXT,
  email TEXT,
  contact_type public.contact_type NOT NULL DEFAULT 'PURCHASING',
  influence_level public.influence_level NOT NULL DEFAULT 'MEDIUM',
  decision_power public.decision_power NOT NULL DEFAULT 'INFLUENCER',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Customer Equipment
CREATE TABLE IF NOT EXISTS public.customer_equipment (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  equipment_type TEXT NOT NULL,
  brand TEXT,
  model TEXT,
  quantity INTEGER DEFAULT 1,
  application TEXT,
  operating_condition TEXT,
  current_brand TEXT,
  current_product TEXT,
  current_viscosity TEXT,
  oil_capacity NUMERIC(10, 2),
  drain_interval TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Customer Products (Multi-brand usage & Shell status)
CREATE TABLE IF NOT EXISTS public.customer_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  product_name TEXT NOT NULL,
  category TEXT,
  viscosity TEXT,
  usage_application TEXT,
  monthly_volume NUMERIC(12, 2),
  status public.customer_product_status NOT NULL DEFAULT 'CURRENT',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Products Master (Shell Catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL DEFAULT 'Shell',
  product_name TEXT NOT NULL,
  category TEXT,
  viscosity TEXT,
  packaging TEXT,
  packaging_size NUMERIC(10, 2),
  application TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Competitors Master
CREATE TABLE IF NOT EXISTS public.competitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand TEXT NOT NULL,
  product_name TEXT,
  category TEXT,
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Visits
CREATE TABLE IF NOT EXISTS public.visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  visit_date DATE NOT NULL,
  visit_type public.visit_type NOT NULL DEFAULT 'ROUTINE',
  purpose TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  latitude NUMERIC(10, 7),
  longitude NUMERIC(10, 7),
  visit_status public.visit_status NOT NULL DEFAULT 'PLANNED',
  customer_response public.customer_response,
  discussion TEXT,
  customer_condition TEXT,
  competitor_id UUID REFERENCES public.competitors(id) ON DELETE SET NULL,
  technical_issue TEXT,
  opportunity_found BOOLEAN NOT NULL DEFAULT false,
  potential_volume NUMERIC(12, 2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Visit POPSAs
CREATE TABLE IF NOT EXISTS public.visit_popsas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL UNIQUE REFERENCES public.visits(id) ON DELETE CASCADE,
  purpose TEXT,
  objective TEXT,
  premises TEXT,
  strategy TEXT,
  anticipate TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Visit Photos
CREATE TABLE IF NOT EXISTS public.visit_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type public.photo_type NOT NULL DEFAULT 'WORKSHOP',
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Opportunities (Pipeline)
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  opportunity_name TEXT NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  stage public.opportunity_stage NOT NULL DEFAULT 'PROSPECT',
  potential_volume NUMERIC(12, 2),
  potential_value NUMERIC(14, 2),
  probability INTEGER DEFAULT 20,
  expected_close_date DATE,
  competitor_id UUID REFERENCES public.competitors(id) ON DELETE SET NULL,
  customer_need TEXT,
  objection TEXT,
  next_action TEXT,
  next_action_date DATE,
  status TEXT DEFAULT 'OPEN',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Follow Ups (Task Engine)
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES public.visits(id) ON DELETE SET NULL,
  opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  activity_type public.follow_up_activity_type NOT NULL DEFAULT 'WHATSAPP',
  description TEXT,
  due_date DATE NOT NULL,
  priority public.follow_up_priority NOT NULL DEFAULT 'MEDIUM',
  status public.follow_up_status NOT NULL DEFAULT 'PENDING',
  completed_at TIMESTAMPTZ,
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 3. STORED FUNCTIONS & PROCEDURES
-- ==============================================================================

-- Generate Customer Code (e.g. CUST-0001)
CREATE OR REPLACE FUNCTION public.generate_customer_code()
RETURNS TEXT AS $$
DECLARE
  next_num INTEGER;
  code TEXT;
BEGIN
  SELECT COALESCE(MAX(SUBSTRING(customer_code FROM 6)::INTEGER), 0) + 1
  INTO next_num
  FROM public.customers
  WHERE customer_code ~ '^CUST-[0-9]+$';

  code := 'CUST-' || LPAD(next_num::TEXT, 4, '0');
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Fuzzy Duplicate Customer Search
CREATE OR REPLACE FUNCTION public.find_similar_customers(p_name TEXT)
RETURNS TABLE (
  id UUID,
  customer_name TEXT,
  city TEXT,
  segment public.customer_segment,
  owner_name TEXT,
  similarity_score REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.customer_name,
    c.city,
    c.segment,
    p.full_name AS owner_name,
    similarity(c.customer_name, p_name) AS similarity_score
  FROM public.customers c
  JOIN public.profiles p ON p.id = c.owner_id
  WHERE similarity(c.customer_name, p_name) > 0.3
  ORDER BY similarity_score DESC
  LIMIT 5;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Access helper functions for RLS
CREATE OR REPLACE FUNCTION public.can_access_customer(customer_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.customers
    WHERE id = customer_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_visit(visit_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.visits
    WHERE id = visit_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, sales_area)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::public.user_role, 'DSR'),
    COALESCE(new.raw_user_meta_data->>'sales_area', 'Jawa Barat')
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to auto-generate customer_code if omitted
CREATE OR REPLACE FUNCTION public.set_customer_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.customer_code IS NULL OR NEW.customer_code = '' THEN
    NEW.customer_code := public.generate_customer_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_customer_code ON public.customers;
CREATE TRIGGER trigger_set_customer_code
  BEFORE INSERT ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_customer_code();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper: Check if user is SPV, Manager, or Admin
CREATE OR REPLACE FUNCTION public.is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('SPV', 'MANAGER', 'ADMIN')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_popsas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.visit_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.is_manager_or_admin());

-- 2. Customers
CREATE POLICY "customers_select" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "customers_insert" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by OR auth.uid() = owner_id OR public.is_manager_or_admin());

CREATE POLICY "customers_update" ON public.customers
  FOR UPDATE TO authenticated
  USING (auth.uid() = owner_id OR auth.uid() = created_by OR public.is_manager_or_admin())
  WITH CHECK (auth.uid() = owner_id OR auth.uid() = created_by OR public.is_manager_or_admin());

CREATE POLICY "customers_delete" ON public.customers
  FOR DELETE TO authenticated
  USING (public.is_manager_or_admin());

-- 3. Customer Contacts, Equipment, Products
CREATE POLICY "contacts_select" ON public.customer_contacts
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "contacts_write" ON public.customer_contacts
  FOR ALL TO authenticated
  USING (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_contacts.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  )
  WITH CHECK (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_contacts.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  );

CREATE POLICY "equipment_select" ON public.customer_equipment
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "equipment_write" ON public.customer_equipment
  FOR ALL TO authenticated
  USING (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_equipment.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  )
  WITH CHECK (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_equipment.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  );

CREATE POLICY "cust_prod_select" ON public.customer_products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "cust_prod_write" ON public.customer_products
  FOR ALL TO authenticated
  USING (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_products.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  )
  WITH CHECK (
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = customer_products.customer_id
      AND (customers.owner_id = auth.uid() OR customers.created_by = auth.uid())
    )
  );

-- 4. Products & Competitors (Master Catalog)
CREATE POLICY "products_select" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "products_write" ON public.products
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

CREATE POLICY "competitors_select" ON public.competitors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "competitors_write" ON public.competitors
  FOR ALL TO authenticated
  USING (public.is_manager_or_admin())
  WITH CHECK (public.is_manager_or_admin());

-- 5. Visits
CREATE POLICY "visits_select" ON public.visits
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = visits.customer_id
      AND customers.owner_id = auth.uid()
    )
  );

CREATE POLICY "visits_insert" ON public.visits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_manager_or_admin());

CREATE POLICY "visits_update" ON public.visits
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_manager_or_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_manager_or_admin());

CREATE POLICY "visits_delete" ON public.visits
  FOR DELETE TO authenticated
  USING (public.is_manager_or_admin());

-- 6. Visit POPSAs & Photos
CREATE POLICY "popsas_select" ON public.visit_popsas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  );

CREATE POLICY "popsas_write" ON public.visit_popsas
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  );

CREATE POLICY "photos_select" ON public.visit_photos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  );

CREATE POLICY "photos_write" ON public.visit_photos
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (visits.user_id = auth.uid() OR public.is_manager_or_admin())
    )
  );

-- 7. Opportunities (Pipeline)
CREATE POLICY "opps_select" ON public.opportunities
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid() OR
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = opportunities.customer_id
      AND customers.owner_id = auth.uid()
    )
  );

CREATE POLICY "opps_insert" ON public.opportunities
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = created_by OR public.is_manager_or_admin());

CREATE POLICY "opps_update" ON public.opportunities
  FOR UPDATE TO authenticated
  USING (auth.uid() = created_by OR public.is_manager_or_admin())
  WITH CHECK (auth.uid() = created_by OR public.is_manager_or_admin());

CREATE POLICY "opps_delete" ON public.opportunities
  FOR DELETE TO authenticated
  USING (public.is_manager_or_admin());

-- 8. Follow Ups (Task Engine)
CREATE POLICY "followups_select" ON public.follow_ups
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid() OR
    public.is_manager_or_admin() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE customers.id = follow_ups.customer_id
      AND customers.owner_id = auth.uid()
    )
  );

CREATE POLICY "followups_insert" ON public.follow_ups
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_manager_or_admin());

CREATE POLICY "followups_update" ON public.follow_ups
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id OR public.is_manager_or_admin())
  WITH CHECK (auth.uid() = user_id OR public.is_manager_or_admin());

CREATE POLICY "followups_delete" ON public.follow_ups
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id OR public.is_manager_or_admin());

-- ==============================================================================
-- 5. SEED MASTER DATA (Shell Products & Competitors)
-- ==============================================================================

-- Shell Products Catalog
INSERT INTO public.products (brand, product_name, category, viscosity, packaging, packaging_size, application)
VALUES
  ('Shell', 'Rimula R4 X', 'Engine Oil', '15W-40', 'Drum', 209, 'Heavy Duty Diesel Engine'),
  ('Shell', 'Rimula R4 X', 'Engine Oil', '15W-40', 'Pail', 20, 'Heavy Duty Diesel Engine'),
  ('Shell', 'Rimula R5 E', 'Synthetic Engine Oil', '10W-40', 'Drum', 209, 'Fleet Transport & Bus'),
  ('Shell', 'Tellus S2 V 46', 'Hydraulic Oil', 'ISO VG 46', 'Drum', 209, 'Industrial & Mining Hydraulic'),
  ('Shell', 'Tellus S2 M 68', 'Hydraulic Oil', 'ISO VG 68', 'Drum', 209, 'Heavy Industrial Hydraulic'),
  ('Shell', 'Omala S2 G 220', 'Gear Oil', 'ISO VG 220', 'Drum', 209, 'Enclosed Industrial Gearbox'),
  ('Shell', 'Spirax S2 G 90', 'Transmission & Axle', '80W-90', 'Pail', 20, 'Manual Transmission & Differential'),
  ('Shell', 'Gadus S2 V220 2', 'Grease', 'NLGI 2', 'Pail', 18, 'Multi-purpose Bearing Grease')
ON CONFLICT DO NOTHING;

-- Competitors Master
INSERT INTO public.competitors (brand, product_name, category, notes)
VALUES
  ('Pertamina', 'Meditran SX 15W-40', 'Engine Oil', 'Kompetitor utama armada & bus'),
  ('Pertamina', 'Turalik 52 (ISO 68)', 'Hydraulic Oil', 'Banyak dipakai manufaktur lokal'),
  ('Pertamina', 'Rored HD A 90', 'Gear Oil', 'Pelumas gardan armada umum'),
  ('Mobil', 'Delvac MX 15W-40', 'Engine Oil', 'Segmen fleet komersial'),
  ('Mobil', 'DTE 25 Hydraulic', 'Hydraulic Oil', 'Pabrik manufaktur presisi tinggi'),
  ('TotalEnergies', 'Rubia TIR 7400 15W-40', 'Engine Oil', 'Alat berat & konstruksi'),
  ('Castrol', 'CRB Turbomax 15W-40', 'Engine Oil', 'Truk & transportasi antar kota')
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- 6. PERFORMANCE & FOREIGN KEY INDEXES
-- ==============================================================================

-- Customers
CREATE INDEX IF NOT EXISTS idx_customers_owner_id ON public.customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_priority ON public.customers(priority);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON public.customers(segment);
CREATE INDEX IF NOT EXISTS idx_customers_city ON public.customers(city);

-- Customer Contacts
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON public.customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_is_primary ON public.customer_contacts(customer_id) WHERE is_primary = true;

-- Customer Equipment & Products
CREATE INDEX IF NOT EXISTS idx_customer_equipment_customer_id ON public.customer_equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_products_customer_id ON public.customer_products(customer_id);

-- Visits
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON public.visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_visit_date ON public.visits(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(visit_status);
CREATE INDEX IF NOT EXISTS idx_visits_user_date ON public.visits(user_id, visit_date DESC);

-- Visit POPSAs & Photos
CREATE INDEX IF NOT EXISTS idx_visit_popsas_visit_id ON public.visit_popsas(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_photos_visit_id ON public.visit_photos(visit_id);

-- Opportunities (Pipeline)
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON public.opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_product_id ON public.opportunities(product_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_expected_close ON public.opportunities(expected_close_date);

-- Follow Ups (Task Engine)
CREATE INDEX IF NOT EXISTS idx_follow_ups_customer_id ON public.follow_ups(customer_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user_id ON public.follow_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_opportunity_id ON public.follow_ups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_visit_id ON public.follow_ups(visit_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_date ON public.follow_ups(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user_status_due ON public.follow_ups(user_id, status, due_date ASC);

