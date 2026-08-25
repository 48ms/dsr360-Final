-- ==============================================================================
-- DSR360 — Row Level Security (RLS) Hardening & Fix Migration
-- Run this in Supabase SQL Editor to enforce strict role & area-scoped security
-- ==============================================================================

-- Drop legacy helper functions if exist
DROP FUNCTION IF EXISTS public.is_manager_or_admin();

-- 1. Helper: Check if current user is ADMIN or MANAGER (Full company-wide access)
CREATE OR REPLACE FUNCTION public.is_admin_or_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
    AND role IN ('ADMIN', 'MANAGER')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Helper: Check if current user can access a specific customer
-- Rules:
--   - Admin / Manager: TRUE (all company data across all sales areas)
--   - SPV: TRUE if customer's sales_area matches SPV's sales_area OR customer owner's sales_area matches SPV's sales_area
--   - DSR: TRUE if owner_id = auth.uid() OR created_by = auth.uid()
CREATE OR REPLACE FUNCTION public.can_access_customer(cust_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_role public.user_role;
  v_user_area TEXT;
  v_cust_area TEXT;
  v_owner_id UUID;
  v_created_by UUID;
BEGIN
  SELECT role, sales_area INTO v_role, v_user_area
  FROM public.profiles
  WHERE id = auth.uid();

  IF v_role IN ('ADMIN', 'MANAGER') THEN
    RETURN TRUE;
  END IF;

  SELECT sales_area, owner_id, created_by
  INTO v_cust_area, v_owner_id, v_created_by
  FROM public.customers
  WHERE id = cust_id;

  IF v_role = 'SPV' THEN
    RETURN (v_cust_area = v_user_area) OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = v_owner_id AND sales_area = v_user_area
    );
  END IF;

  RETURN (v_owner_id = auth.uid() OR v_created_by = auth.uid());
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
  USING (auth.uid() = id OR public.is_admin_or_manager());

-- 2. Customers
CREATE POLICY "customers_select" ON public.customers
  FOR SELECT TO authenticated
  USING (public.can_access_customer(id));

CREATE POLICY "customers_insert" ON public.customers
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_admin_or_manager()
    OR (
      EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'SPV'
        AND sales_area = customers.sales_area
      )
    )
    OR (auth.uid() = created_by OR auth.uid() = owner_id)
  );

CREATE POLICY "customers_update" ON public.customers
  FOR UPDATE TO authenticated
  USING (public.can_access_customer(id))
  WITH CHECK (public.can_access_customer(id));

CREATE POLICY "customers_delete" ON public.customers
  FOR DELETE TO authenticated
  USING (public.is_admin_or_manager());

-- 3. Customer Contacts, Equipment, Products (Inherits customer access)
CREATE POLICY "contacts_select" ON public.customer_contacts
  FOR SELECT TO authenticated
  USING (public.can_access_customer(customer_id));

CREATE POLICY "contacts_write" ON public.customer_contacts
  FOR ALL TO authenticated
  USING (public.can_access_customer(customer_id))
  WITH CHECK (public.can_access_customer(customer_id));

CREATE POLICY "equipment_select" ON public.customer_equipment
  FOR SELECT TO authenticated
  USING (public.can_access_customer(customer_id));

CREATE POLICY "equipment_write" ON public.customer_equipment
  FOR ALL TO authenticated
  USING (public.can_access_customer(customer_id))
  WITH CHECK (public.can_access_customer(customer_id));

CREATE POLICY "cust_prod_select" ON public.customer_products
  FOR SELECT TO authenticated
  USING (public.can_access_customer(customer_id));

CREATE POLICY "cust_prod_write" ON public.customer_products
  FOR ALL TO authenticated
  USING (public.can_access_customer(customer_id))
  WITH CHECK (public.can_access_customer(customer_id));

-- 4. Products & Competitors (Master Catalog)
CREATE POLICY "products_select" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "products_write" ON public.products
  FOR ALL TO authenticated
  USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

CREATE POLICY "competitors_select" ON public.competitors
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "competitors_write" ON public.competitors
  FOR ALL TO authenticated
  USING (public.is_admin_or_manager())
  WITH CHECK (public.is_admin_or_manager());

-- 5. Visits
CREATE POLICY "visits_select" ON public.visits
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
    OR EXISTS (
      SELECT 1 FROM public.profiles p_viewer
      JOIN public.profiles p_creator ON p_creator.id = visits.user_id
      WHERE p_viewer.id = auth.uid()
      AND p_viewer.role = 'SPV'
      AND p_viewer.sales_area = p_creator.sales_area
    )
  );

CREATE POLICY "visits_insert" ON public.visits
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id OR public.is_admin_or_manager());

CREATE POLICY "visits_update" ON public.visits
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  );

CREATE POLICY "visits_delete" ON public.visits
  FOR DELETE TO authenticated
  USING (public.is_admin_or_manager());

-- 6. Visit POPSAs & Photos
CREATE POLICY "popsas_select" ON public.visit_popsas
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  );

CREATE POLICY "popsas_write" ON public.visit_popsas
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_popsas.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  );

CREATE POLICY "photos_select" ON public.visit_photos
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  );

CREATE POLICY "photos_write" ON public.visit_photos
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.visits
      WHERE visits.id = visit_photos.visit_id
      AND (
        visits.user_id = auth.uid()
        OR public.is_admin_or_manager()
        OR (visits.customer_id IS NOT NULL AND public.can_access_customer(visits.customer_id))
      )
    )
  );

-- 7. Opportunities (Pipeline)
CREATE POLICY "opps_select" ON public.opportunities
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
    OR EXISTS (
      SELECT 1 FROM public.profiles p_viewer
      JOIN public.profiles p_creator ON p_creator.id = opportunities.created_by
      WHERE p_viewer.id = auth.uid()
      AND p_viewer.role = 'SPV'
      AND p_viewer.sales_area = p_creator.sales_area
    )
  );

CREATE POLICY "opps_insert" ON public.opportunities
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = created_by
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  );

CREATE POLICY "opps_update" ON public.opportunities
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = created_by
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  )
  WITH CHECK (
    auth.uid() = created_by
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  );

CREATE POLICY "opps_delete" ON public.opportunities
  FOR DELETE TO authenticated
  USING (public.is_admin_or_manager());

-- 8. Follow Ups (Task Engine)
CREATE POLICY "followups_select" ON public.follow_ups
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
    OR EXISTS (
      SELECT 1 FROM public.profiles p_viewer
      JOIN public.profiles p_creator ON p_creator.id = follow_ups.user_id
      WHERE p_viewer.id = auth.uid()
      AND p_viewer.role = 'SPV'
      AND p_viewer.sales_area = p_creator.sales_area
    )
  );

CREATE POLICY "followups_insert" ON public.follow_ups
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  );

CREATE POLICY "followups_update" ON public.follow_ups
  FOR UPDATE TO authenticated
  USING (
    auth.uid() = user_id
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  )
  WITH CHECK (
    auth.uid() = user_id
    OR public.is_admin_or_manager()
    OR (customer_id IS NOT NULL AND public.can_access_customer(customer_id))
  );

CREATE POLICY "followups_delete" ON public.follow_ups
  FOR DELETE TO authenticated
  USING (public.is_admin_or_manager());
