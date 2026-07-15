/*
# Create site_settings table for editable homepage content

1. New Tables
- `site_settings`
  - `key` (text, primary key) — unique setting identifier (e.g. 'hero_image_url')
  - `value` (text, nullable) — the setting value (e.g. a public image URL)
  - `updated_at` (timestamptz, defaults to now()) — last modification timestamp
2. Seed Data
- Insert a row with key='hero_image_url' and the current Pexels URL as the default value.
- Uses ON CONFLICT (key) DO NOTHING so re-running is safe.
3. Security (RLS)
- Enable RLS on `site_settings`.
- Allow anon + authenticated users to SELECT (read) — the homepage reads settings with the anon key.
- Allow anon + authenticated users to INSERT, UPDATE, DELETE — the admin panel operates with the anon key.
- All policies use USING/WITH CHECK (true) because site settings are intentionally shared/public content.
4. Notes
- This app has no sign-in screen; the admin panel operates with the anon key, matching the existing pattern on vehicles/bookings/reviews tables.
*/

CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_site_settings" ON site_settings;
CREATE POLICY "anon_select_site_settings"
ON site_settings FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "anon_insert_site_settings" ON site_settings;
CREATE POLICY "anon_insert_site_settings"
ON site_settings FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_site_settings" ON site_settings;
CREATE POLICY "anon_update_site_settings"
ON site_settings FOR UPDATE
TO anon, authenticated
USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_site_settings" ON site_settings;
CREATE POLICY "anon_delete_site_settings"
ON site_settings FOR DELETE
TO anon, authenticated
USING (true);

INSERT INTO site_settings (key, value)
VALUES ('hero_image_url', 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=1920')
ON CONFLICT (key) DO NOTHING;
