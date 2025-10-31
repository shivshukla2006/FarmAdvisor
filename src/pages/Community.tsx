import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageSquare, ThumbsUp, ThumbsDown, Send, Plus, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  view_count: number;
  created_at: string;
  user_id: string;
  replies?: Reply[];
}

interface Reply {
  id: string;
  content: string;
  upvotes: number;
  downvotes: number;
  created_at: string;
  user_id: string;
}

const categories = [
  "Crop Management",
  "Pest Control",
  "Weather Discussion",
  "Market Prices",
  "Equipment",
  "Government Schemes",
  "General Discussion"
];

const Community = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  
  // New post form
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    category: "",
    tags: ""
  });

  // Reply form
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchPosts();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('community-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'community_posts' }, () => {
        fetchPosts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.title || !newPost.content || !newPost.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user?.id,
          title: newPost.title,
          content: newPost.content,
          category: newPost.category,
          tags: newPost.tags ? newPost.tags.split(',').map(t => t.trim()) : []
        });

      if (error) throw error;

      // Log activity
      await supabase.from('user_activities').insert({
        user_id: user?.id,
        activity_type: 'forum_post',
        title: 'Created a community post',
        description: newPost.title
      });

      toast({
        title: "Success",
        description: "Your post has been published"
      });

      setIsCreateDialogOpen(false);
      setNewPost({ title: "", content: "", category: "", tags: "" });
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive"
      });
    }
  };

  const handleVote = async (postId: string, voteType: 'up' | 'down') => {
    try {
      const { data: existingVote } = await supabase
        .from('post_votes')
        .select('*')
        .eq('post_id', postId)
        .eq('user_id', user?.id)
        .single();

      if (existingVote) {
        if (existingVote.vote_type === voteType) {
          // Remove vote
          await supabase.from('post_votes').delete().eq('id', existingVote.id);
        } else {
          // Change vote
          await supabase.from('post_votes').update({ vote_type: voteType }).eq('id', existingVote.id);
        }
      } else {
        // New vote
        await supabase.from('post_votes').insert({
          post_id: postId,
          user_id: user?.id,
          vote_type: voteType
        });
      }

      fetchPosts();
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const submitReply = async (postId: string) => {
    if (!replyContent.trim()) return;

    try {
      const { error } = await supabase
        .from('community_replies')
        .insert({
          post_id: postId,
          user_id: user?.id,
          content: replyContent
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your reply has been posted"
      });

      setReplyContent("");
      fetchPosts();
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply",
        variant: "destructive"
      });
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2">Community Forum</h1>
            <p className="text-muted-foreground">
              Connect with fellow farmers, share knowledge, and get advice
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Share your question, experience, or insight with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What's your post about?"
                    value={newPost.title}
                    onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={newPost.category} onValueChange={(value) => setNewPost({ ...newPost, category: value })}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your thoughts, questions, or advice..."
                    rows={6}
                    value={newPost.content}
                    onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    placeholder="wheat, irrigation, fertilizer"
                    value={newPost.tags}
                    onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  />
                </div>
                <Button onClick={createPost} className="w-full">
                  Publish Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="space-y-4">
            {loading ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">Loading posts...</p>
              </Card>
            ) : filteredPosts.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No posts found</p>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(post.id, 'up')}
                      >
                        <ThumbsUp className="h-5 w-5" />
                      </Button>
                      <span className="font-bold">{(post.upvotes || 0) - (post.downvotes || 0)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleVote(post.id, 'down')}
                      >
                        <ThumbsDown className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-heading font-bold mb-2">{post.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="outline">{post.category}</Badge>
                            {post.tags?.map((tag, i) => (
                              <Badge key={i} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.content}</p>
                      
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            0 replies
                          </span>
                          <span>{post.view_count || 0} views</span>
                          <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        </div>
                        <Button variant="outline" size="sm">
                          View Discussion
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
          
          <TabsContent value="popular" className="space-y-4">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Popular posts will appear here</p>
            </Card>
          </TabsContent>
          
          <TabsContent value="unanswered" className="space-y-4">
            <Card className="p-12 text-center">
              <p className="text-muted-foreground">Unanswered questions will appear here</p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Community;
