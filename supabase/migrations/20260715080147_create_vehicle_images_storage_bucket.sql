/*
# Create vehicle-images public storage bucket

1. Storage
- Create a public bucket named `vehicle-images` for storing vehicle photo uploads.
- The bucket is public so vehicle images are readable via their public URL without authentication.
2. Security (Storage policies)
- Allow anon + authenticated users to SELECT (read) objects — images are public-facing.
- Allow anon + authenticated users to INSERT (upload) objects — admin panel uses anon key.
- Allow anon + authenticated users to UPDATE (replace) objects — for editing existing vehicle photos.
- Allow anon + authenticated users to DELETE objects — for removing old images on replacement.
3. Notes
- This app has no sign-in screen; the admin panel operates with the anon key.
- All policies are scoped TO anon, authenticated with USING/WITH CHECK (true) because the bucket is intentionally public.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('vehicle-images', 'vehicle-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "anon_select_vehicle_images" ON storage.objects;
CREATE POLICY "anon_select_vehicle_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'vehicle-images');

DROP POLICY IF EXISTS "anon_insert_vehicle_images" ON storage.objects;
CREATE POLICY "anon_insert_vehicle_images"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'vehicle-images');

DROP POLICY IF EXISTS "anon_update_vehicle_images" ON storage.objects;
CREATE POLICY "anon_update_vehicle_images"
ON storage.objects FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'vehicle-images') WITH CHECK (bucket_id = 'vehicle-images');

DROP POLICY IF EXISTS "anon_delete_vehicle_images" ON storage.objects;
CREATE POLICY "anon_delete_vehicle_images"
ON storage.objects FOR DELETE
TO anon, authenticated
USING (bucket_id = 'vehicle-images');
