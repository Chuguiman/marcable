-- =============================================================================
-- Vigilancia (Brand Monitoring) Tables
-- Allows users to monitor brands and receive alerts on new similar trademarks
-- =============================================================================

-- Vigilancia pricing tiers
CREATE TABLE vigilancia_tiers (
    id              bigserial PRIMARY KEY,
    code            varchar(30) NOT NULL UNIQUE,
    name            varchar(100) NOT NULL,
    description     text,
    max_brands      int NOT NULL,
    price_monthly   numeric(10,2) NOT NULL,
    price_yearly    numeric(10,2),
    currency        varchar(3) DEFAULT 'USD',
    is_active       boolean DEFAULT true,
    sort_order      int DEFAULT 0,
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);

INSERT INTO vigilancia_tiers (code, name, description, max_brands, price_monthly, price_yearly, sort_order) VALUES
('starter', 'Starter', 'Monitoreo basico para marcas individuales', 5, 9.99, 99.00, 1),
('professional', 'Profesional', 'Para oficinas de abogados y consultores', 25, 29.99, 299.00, 2),
('enterprise', 'Empresarial', 'Monitoreo masivo para grandes portafolios', 100, 79.99, 799.00, 3);

-- Monitors
CREATE TABLE vigilancia_monitors (
    id              bigserial PRIMARY KEY,
    user_profile_id bigint NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name            varchar(200) NOT NULL,
    monitor_type    varchar(20) NOT NULL DEFAULT 'individual',
    country_id      bigint NOT NULL REFERENCES countries(id) ON DELETE RESTRICT,
    tier_id         bigint REFERENCES vigilancia_tiers(id) ON DELETE SET NULL,
    status          varchar(20) NOT NULL DEFAULT 'active',
    started_at      timestamptz DEFAULT now(),
    expires_at      timestamptz,
    stripe_sub_id   varchar(100),
    created_at      timestamptz DEFAULT now(),
    updated_at      timestamptz DEFAULT now()
);
CREATE INDEX idx_vig_monitors_user ON vigilancia_monitors(user_profile_id);
CREATE INDEX idx_vig_monitors_status ON vigilancia_monitors(status) WHERE status = 'active';
CREATE INDEX idx_vig_monitors_country ON vigilancia_monitors(country_id);

-- Items within a monitor
CREATE TABLE vigilancia_items (
    id                  bigserial PRIMARY KEY,
    monitor_id          bigint NOT NULL REFERENCES vigilancia_monitors(id) ON DELETE CASCADE,
    denomination_text   varchar(500) NOT NULL,
    nice_classes        smallint[] DEFAULT '{}',
    search_profile_id   bigint REFERENCES similarity_profiles(id) ON DELETE SET NULL,
    match_threshold     numeric(3,2) DEFAULT 0.45,
    is_active           boolean DEFAULT true,
    last_checked_at     timestamptz,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);
CREATE INDEX idx_vig_items_monitor ON vigilancia_items(monitor_id);
CREATE INDEX idx_vig_items_active ON vigilancia_items(is_active) WHERE is_active = true;

-- Alerts
CREATE TABLE vigilancia_alerts (
    id                  bigserial PRIMARY KEY,
    monitor_id          bigint NOT NULL REFERENCES vigilancia_monitors(id) ON DELETE CASCADE,
    item_id             bigint NOT NULL REFERENCES vigilancia_items(id) ON DELETE CASCADE,
    matched_trademark_id bigint REFERENCES trademarks(id) ON DELETE SET NULL,
    publication_id      bigint REFERENCES publications(id) ON DELETE SET NULL,
    similarity_score    numeric(4,3),
    match_type          varchar(20) NOT NULL,
    match_details       jsonb,
    status              varchar(20) NOT NULL DEFAULT 'new',
    notified_at         timestamptz,
    created_at          timestamptz DEFAULT now(),
    updated_at          timestamptz DEFAULT now()
);
CREATE INDEX idx_vig_alerts_monitor ON vigilancia_alerts(monitor_id);
CREATE INDEX idx_vig_alerts_item ON vigilancia_alerts(item_id);
CREATE INDEX idx_vig_alerts_status ON vigilancia_alerts(status) WHERE status IN ('new', 'viewed');
CREATE INDEX idx_vig_alerts_created ON vigilancia_alerts(created_at DESC);

-- RLS
ALTER TABLE vigilancia_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigilancia_monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigilancia_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigilancia_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read vig_tiers" ON vigilancia_tiers FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "own monitors" ON vigilancia_monitors FOR SELECT TO authenticated USING (user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "own monitors insert" ON vigilancia_monitors FOR INSERT TO authenticated WITH CHECK (user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "own monitors update" ON vigilancia_monitors FOR UPDATE TO authenticated USING (user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid()));
CREATE POLICY "own items" ON vigilancia_items FOR SELECT TO authenticated USING (monitor_id IN (SELECT id FROM vigilancia_monitors WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));
CREATE POLICY "own items insert" ON vigilancia_items FOR INSERT TO authenticated WITH CHECK (monitor_id IN (SELECT id FROM vigilancia_monitors WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));
CREATE POLICY "own alerts" ON vigilancia_alerts FOR SELECT TO authenticated USING (monitor_id IN (SELECT id FROM vigilancia_monitors WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));
CREATE POLICY "own alerts update" ON vigilancia_alerts FOR UPDATE TO authenticated USING (monitor_id IN (SELECT id FROM vigilancia_monitors WHERE user_profile_id IN (SELECT id FROM user_profiles WHERE auth_user_id = auth.uid())));
