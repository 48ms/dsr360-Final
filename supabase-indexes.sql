-- ==============================================================================
-- DSR360 — Performance & Foreign Key Indexes Migration
-- Execute in Supabase SQL Editor to speed up joins and filtering queries
-- ==============================================================================

-- 1. Customers Indexes
CREATE INDEX IF NOT EXISTS idx_customers_owner_id ON public.customers(owner_id);
CREATE INDEX IF NOT EXISTS idx_customers_created_by ON public.customers(created_by);
CREATE INDEX IF NOT EXISTS idx_customers_status ON public.customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_priority ON public.customers(priority);
CREATE INDEX IF NOT EXISTS idx_customers_segment ON public.customers(segment);
CREATE INDEX IF NOT EXISTS idx_customers_city ON public.customers(city);

-- 2. Customer Contacts Indexes
CREATE INDEX IF NOT EXISTS idx_customer_contacts_customer_id ON public.customer_contacts(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_contacts_is_primary ON public.customer_contacts(customer_id) WHERE is_primary = true;

-- 3. Customer Equipment & Products Indexes
CREATE INDEX IF NOT EXISTS idx_customer_equipment_customer_id ON public.customer_equipment(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_products_customer_id ON public.customer_products(customer_id);

-- 4. Visits Indexes
CREATE INDEX IF NOT EXISTS idx_visits_customer_id ON public.visits(customer_id);
CREATE INDEX IF NOT EXISTS idx_visits_user_id ON public.visits(user_id);
CREATE INDEX IF NOT EXISTS idx_visits_visit_date ON public.visits(visit_date DESC);
CREATE INDEX IF NOT EXISTS idx_visits_status ON public.visits(visit_status);
CREATE INDEX IF NOT EXISTS idx_visits_user_date ON public.visits(user_id, visit_date DESC);

-- 5. Visit POPSAs & Photos Indexes
CREATE INDEX IF NOT EXISTS idx_visit_popsas_visit_id ON public.visit_popsas(visit_id);
CREATE INDEX IF NOT EXISTS idx_visit_photos_visit_id ON public.visit_photos(visit_id);

-- 6. Opportunities (Pipeline) Indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_customer_id ON public.opportunities(customer_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON public.opportunities(created_by);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON public.opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_opportunities_status ON public.opportunities(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_product_id ON public.opportunities(product_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_expected_close ON public.opportunities(expected_close_date);

-- 7. Follow Ups (Task Engine) Indexes
CREATE INDEX IF NOT EXISTS idx_follow_ups_customer_id ON public.follow_ups(customer_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user_id ON public.follow_ups(user_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_opportunity_id ON public.follow_ups(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_visit_id ON public.follow_ups(visit_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_due_date ON public.follow_ups(due_date ASC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_status ON public.follow_ups(status);
CREATE INDEX IF NOT EXISTS idx_follow_ups_user_status_due ON public.follow_ups(user_id, status, due_date ASC);
