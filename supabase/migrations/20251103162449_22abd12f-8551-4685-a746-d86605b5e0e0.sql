-- Allow public read access to post_votes for vote count aggregation
-- Vote counts are public information in a community forum
CREATE POLICY "Post votes are publicly readable for vote counts"
ON public.post_votes
FOR SELECT
USING (true);

-- Also add public read policy for reply_votes
CREATE POLICY "Reply votes are publicly readable for vote counts"
ON public.reply_votes
FOR SELECT
USING (true);