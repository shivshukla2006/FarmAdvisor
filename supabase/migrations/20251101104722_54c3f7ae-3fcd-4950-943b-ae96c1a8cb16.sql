-- Add views for aggregate vote counts to protect user privacy
-- This addresses the security concern about exposing individual voting patterns

-- Create a view for post vote counts (aggregate data only)
CREATE OR REPLACE VIEW public.post_vote_counts AS
SELECT 
  post_id,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvote_count,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvote_count,
  COUNT(*) as total_votes
FROM public.post_votes
GROUP BY post_id;

-- Create a view for reply vote counts (aggregate data only)
CREATE OR REPLACE VIEW public.reply_vote_counts AS
SELECT 
  reply_id,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvote_count,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvote_count,
  COUNT(*) as total_votes
FROM public.reply_votes
GROUP BY reply_id;

-- Update RLS policies to restrict direct access to individual votes
-- Users can still see their own votes, but not others'
DROP POLICY IF EXISTS "Users can view all votes" ON public.post_votes;
CREATE POLICY "Users can view their own votes"
ON public.post_votes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all reply votes" ON public.reply_votes;
CREATE POLICY "Users can view their own reply votes"
ON public.reply_votes
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Grant access to the aggregate views for all authenticated users
GRANT SELECT ON public.post_vote_counts TO authenticated;
GRANT SELECT ON public.reply_vote_counts TO authenticated;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_post_votes_post_id ON public.post_votes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_votes_user_id ON public.post_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_reply_votes_reply_id ON public.reply_votes(reply_id);
CREATE INDEX IF NOT EXISTS idx_reply_votes_user_id ON public.reply_votes(user_id);

-- Add indexes for community posts and replies for better performance
CREATE INDEX IF NOT EXISTS idx_community_posts_user_id ON public.community_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_replies_post_id ON public.community_replies(post_id);
CREATE INDEX IF NOT EXISTS idx_community_replies_user_id ON public.community_replies(user_id);

-- Add storage bucket for pest diagnosis images if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('pest-images', 'pest-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for pest images
CREATE POLICY "Users can upload their own pest images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'pest-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own pest images"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'pest-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Pest images are publicly viewable"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'pest-images');