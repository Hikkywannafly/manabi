-- Create 'uploads' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access
CREATE POLICY "Public Access" ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- Policy: Allow authenticated users to upload
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'uploads' );
