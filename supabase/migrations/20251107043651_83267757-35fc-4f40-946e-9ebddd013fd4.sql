-- Create storage policies for pest-images bucket
-- Allow authenticated users to upload their own images
CREATE POLICY "Users can upload pest images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'pest-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow authenticated users to view all pest images (bucket is public)
CREATE POLICY "Anyone can view pest images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pest-images');

-- Allow users to update their own images
CREATE POLICY "Users can update their own pest images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'pest-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete their own pest images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'pest-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);