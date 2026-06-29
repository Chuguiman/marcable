-- =============================================================================
-- Auth Auto-Provisioning
-- Creates user_profiles + freemium subscription on new signup
-- =============================================================================

-- 1. Seed freemium plan (idempotent)
INSERT INTO subscription_plans (code, name, description, search_limit, is_active, sort_order)
VALUES ('free', 'Gratuito', 'Plan gratuito con búsquedas limitadas', 5, true, 0)
ON CONFLICT (code) DO NOTHING;

-- 2. Auto-provisioning function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  free_plan_id bigint;
BEGIN
  -- Create user profile
  INSERT INTO public.user_profiles (auth_user_id, email)
  VALUES (NEW.id, NEW.email);

  -- Assign freemium subscription
  SELECT id INTO free_plan_id
  FROM public.subscription_plans
  WHERE code = 'free' AND is_active = true
  LIMIT 1;

  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_profile_id,
      plan_id,
      status,
      started_at,
      amount,
      currency
    )
    VALUES (
      (SELECT id FROM public.user_profiles WHERE auth_user_id = NEW.id),
      free_plan_id,
      'active',
      now(),
      0,
      'USD'
    );
  END IF;

  RETURN NEW;
END;
$$;

-- 3. Trigger on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Additional RLS policies for user_profiles
CREATE POLICY "users can update own profile"
  ON user_profiles FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid())
  WITH CHECK (auth_user_id = auth.uid());

CREATE POLICY "users can insert own profile"
  ON user_profiles FOR INSERT TO authenticated
  WITH CHECK (auth_user_id = auth.uid());
