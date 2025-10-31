-- Create enum types for better data integrity
CREATE TYPE public.recommendation_status AS ENUM ('pending', 'completed', 'saved');
CREATE TYPE public.diagnosis_status AS ENUM ('pending', 'completed', 'reviewed');
CREATE TYPE public.alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE public.activity_type AS ENUM ('recommendation', 'diagnosis', 'forum_post', 'scheme_bookmark');

-- Crop Recommendations Table
CREATE TABLE public.crop_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  soil_type TEXT NOT NULL,
  season TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  preferences TEXT[],
  recommendations JSONB NOT NULL,
  status recommendation_status DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own recommendations"
  ON public.crop_recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own recommendations"
  ON public.crop_recommendations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON public.crop_recommendations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
  ON public.crop_recommendations FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_crop_recommendations_updated_at
  BEFORE UPDATE ON public.crop_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Pest Diagnoses Table
CREATE TABLE public.pest_diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  crop_type TEXT,
  diagnosis_result JSONB,
  pest_identified TEXT,
  severity TEXT,
  treatment_recommendations TEXT[],
  status diagnosis_status DEFAULT 'pending',
  user_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pest_diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own diagnoses"
  ON public.pest_diagnoses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own diagnoses"
  ON public.pest_diagnoses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own diagnoses"
  ON public.pest_diagnoses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own diagnoses"
  ON public.pest_diagnoses FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_pest_diagnoses_updated_at
  BEFORE UPDATE ON public.pest_diagnoses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Weather Alerts Table
CREATE TABLE public.weather_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location TEXT NOT NULL,
  alert_type TEXT NOT NULL,
  severity alert_severity NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  affected_regions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.weather_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Weather alerts are publicly readable"
  ON public.weather_alerts FOR SELECT
  USING (true);

-- Government Schemes Table
CREATE TABLE public.government_schemes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  benefits TEXT NOT NULL,
  application_process TEXT,
  application_link TEXT,
  contact_info JSONB,
  state TEXT,
  crop_types TEXT[],
  scheme_type TEXT,
  deadline TIMESTAMPTZ,
  documents_required TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Government schemes are publicly readable"
  ON public.government_schemes FOR SELECT
  USING (active = true);

CREATE TRIGGER update_government_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Scheme Bookmarks Table
CREATE TABLE public.scheme_bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES public.government_schemes(id) ON DELETE CASCADE,
  application_status TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, scheme_id)
);

ALTER TABLE public.scheme_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookmarks"
  ON public.scheme_bookmarks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookmarks"
  ON public.scheme_bookmarks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookmarks"
  ON public.scheme_bookmarks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks"
  ON public.scheme_bookmarks FOR DELETE
  USING (auth.uid() = user_id);

-- Community Posts Table
CREATE TABLE public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  images TEXT[],
  tags TEXT[],
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community posts are publicly readable"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_community_posts_updated_at
  BEFORE UPDATE ON public.community_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Community Replies Table
CREATE TABLE public.community_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  upvotes INTEGER DEFAULT 0,
  downvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community replies are publicly readable"
  ON public.community_replies FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON public.community_replies FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own replies"
  ON public.community_replies FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own replies"
  ON public.community_replies FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_community_replies_updated_at
  BEFORE UPDATE ON public.community_replies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Post Votes Table
CREATE TABLE public.post_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

ALTER TABLE public.post_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all votes"
  ON public.post_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own votes"
  ON public.post_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own votes"
  ON public.post_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own votes"
  ON public.post_votes FOR DELETE
  USING (auth.uid() = user_id);

-- Reply Votes Table
CREATE TABLE public.reply_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reply_id UUID NOT NULL REFERENCES public.community_replies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(reply_id, user_id)
);

ALTER TABLE public.reply_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reply votes"
  ON public.reply_votes FOR SELECT
  USING (true);

CREATE POLICY "Users can create their own reply votes"
  ON public.reply_votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reply votes"
  ON public.reply_votes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reply votes"
  ON public.reply_votes FOR DELETE
  USING (auth.uid() = user_id);

-- User Activities Table (for dashboard recent activities)
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type activity_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own activities"
  ON public.user_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities"
  ON public.user_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_crop_recommendations_user_id ON public.crop_recommendations(user_id);
CREATE INDEX idx_crop_recommendations_created_at ON public.crop_recommendations(created_at DESC);
CREATE INDEX idx_pest_diagnoses_user_id ON public.pest_diagnoses(user_id);
CREATE INDEX idx_pest_diagnoses_created_at ON public.pest_diagnoses(created_at DESC);
CREATE INDEX idx_weather_alerts_location ON public.weather_alerts(location);
CREATE INDEX idx_weather_alerts_severity ON public.weather_alerts(severity);
CREATE INDEX idx_government_schemes_state ON public.government_schemes(state);
CREATE INDEX idx_government_schemes_active ON public.government_schemes(active);
CREATE INDEX idx_community_posts_category ON public.community_posts(category);
CREATE INDEX idx_community_posts_created_at ON public.community_posts(created_at DESC);
CREATE INDEX idx_community_replies_post_id ON public.community_replies(post_id);
CREATE INDEX idx_user_activities_user_id ON public.user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON public.user_activities(created_at DESC);