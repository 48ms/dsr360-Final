-- ==============================================================================
-- DSR360 — Row Level Security (RLS) Hardening & Fix Migration
-- Run this in Supabase SQL Editor to enforce strict role & ownership security
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

-- Drop legacy orphan tables if exist from previous prototypes
DROP TABLE IF EXISTS public.popsa_entries CASCADE;

-- Enable RLS on all tables
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

-- Drop legacy / overly permissive policies
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
DROP POLICY IF EXISTS "customers_all" ON public.customers;
DROP POLICY IF EXISTS "customers_select" ON public.customers;
DROP POLICY IF EXISTS "customers_insert" ON public.customers;
DROP POLICY IF EXISTS "customers_update" ON public.customers;
DROP POLICY IF EXISTS "customers_delete" ON public.customers;
DROP POLICY IF EXISTS "contacts_all" ON public.customer_contacts;
DROP POLICY IF EXISTS "contacts_select" ON public.customer_contacts;
DROP POLICY IF EXISTS "contacts_write" ON public.customer_contacts;
DROP POLICY IF EXISTS "equipment_all" ON public.customer_equipment;
DROP POLICY IF EXISTS "equipment_select" ON public.customer_equipment;
DROP POLICY IF EXISTS "equipment_write" ON public.customer_equipment;
DROP POLICY IF EXISTS "cust_prod_all" ON public.customer_products;
DROP POLICY IF EXISTS "cust_prod_select" ON public.customer_products;
DROP POLICY IF EXISTS "cust_prod_write" ON public.customer_products;
DROP POLICY IF EXISTS "products_select" ON public.products;
DROP POLICY IF EXISTS "products_write" ON public.products;
DROP POLICY IF EXISTS "competitors_select" ON public.competitors;
DROP POLICY IF EXISTS "competitors_write" ON public.competitors;
DROP POLICY IF EXISTS "visits_all" ON public.visits;
DROP POLICY IF EXISTS "visits_select" ON public.visits;
DROP POLICY IF EXISTS "visits_insert" ON public.visits;
DROP POLICY IF EXISTS "visits_update" ON public.visits;
DROP POLICY IF EXISTS "visits_delete" ON public.visits;
DROP POLICY IF EXISTS "popsas_all" ON public.visit_popsas;
DROP POLICY IF EXISTS "popsas_select" ON public.visit_popsas;
DROP POLICY IF EXISTS "popsas_write" ON public.visit_popsas;
DROP POLICY IF EXISTS "photos_all" ON public.visit_photos;
DROP POLICY IF EXISTS "photos_select" ON public.visit_photos;
DROP POLICY IF EXISTS "photos_write" ON public.visit_photos;
DROP POLICY IF EXISTS "opps_all" ON public.opportunities;
DROP POLICY IF EXISTS "opps_select" ON public.opportunities;
DROP POLICY IF EXISTS "opps_insert" ON public.opportunities;
DROP POLICY IF EXISTS "opps_update" ON public.opportunities;
DROP POLICY IF EXISTS "opps_delete" ON public.opportunities;
DROP POLICY IF EXISTS "followups_all" ON public.follow_ups;
DROP POLICY IF EXISTS "followups_select" ON public.follow_ups;
DROP POLICY IF EXISTS "followups_insert" ON public.follow_ups;
DROP POLICY IF EXISTS "followups_update" ON public.follow_ups;
DROP POLICY IF EXISTS "followups_delete" ON public.follow_ups;

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
