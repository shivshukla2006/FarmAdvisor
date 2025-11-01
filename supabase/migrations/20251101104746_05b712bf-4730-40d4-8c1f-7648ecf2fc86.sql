-- Fix security definer views by recreating them without that option
-- Drop and recreate views as SECURITY INVOKER (default)

DROP VIEW IF EXISTS public.post_vote_counts CASCADE;
CREATE VIEW public.post_vote_counts 
WITH (security_invoker = true) AS
SELECT 
  post_id,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvote_count,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvote_count,
  COUNT(*) as total_votes
FROM public.post_votes
GROUP BY post_id;

DROP VIEW IF EXISTS public.reply_vote_counts CASCADE;
CREATE VIEW public.reply_vote_counts
WITH (security_invoker = true) AS
SELECT 
  reply_id,
  COUNT(*) FILTER (WHERE vote_type = 'upvote') as upvote_count,
  COUNT(*) FILTER (WHERE vote_type = 'downvote') as downvote_count,
  COUNT(*) as total_votes
FROM public.reply_votes
GROUP BY reply_id;

-- Grant access to the views
GRANT SELECT ON public.post_vote_counts TO authenticated;
GRANT SELECT ON public.reply_vote_counts TO authenticated;
GRANT SELECT ON public.post_vote_counts TO anon;
GRANT SELECT ON public.reply_vote_counts TO anon;