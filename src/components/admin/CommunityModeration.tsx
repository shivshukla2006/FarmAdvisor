import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, Trash2, Eye, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Post {
  id: string;
  title: string;
  content: string;
  category: string;
  upvotes: number | null;
  downvotes: number | null;
  view_count: number | null;
  created_at: string;
  user_id: string;
}

export const CommunityModeration = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [deletePost, setDeletePost] = useState<Post | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts, isLoading } = useQuery({
    queryKey: ["admin-posts", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("community_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.limit(50);
      if (error) throw error;
      return data as Post[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      // First delete related replies
      await supabase.from("community_replies").delete().eq("post_id", postId);
      // Then delete votes
      await supabase.from("post_votes").delete().eq("post_id", postId);
      // Finally delete the post
      const { error } = await supabase.from("community_posts").delete().eq("id", postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
      toast({ title: "Post deleted successfully" });
      setDeletePost(null);
    },
    onError: (error) => {
      toast({ title: "Error deleting post", description: error.message, variant: "destructive" });
    },
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "crop-management": "bg-primary/10 text-primary",
      "pest-disease": "bg-destructive/10 text-destructive",
      "weather": "bg-blue-500/10 text-blue-500",
      "equipment": "bg-secondary/10 text-secondary-foreground",
      "market-prices": "bg-accent/10 text-accent-foreground",
      "general": "bg-muted text-muted-foreground",
    };
    return colors[category] || colors.general;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Community Moderation
          </CardTitle>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading posts...
                  </TableCell>
                </TableRow>
              ) : posts?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No posts found
                  </TableCell>
                </TableRow>
              ) : (
                posts?.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell>
                      <div className="max-w-[300px]">
                        <div className="font-medium truncate">{post.title}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {post.content.substring(0, 100)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(post.category)} variant="outline">
                        {post.category.replace("-", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-primary">
                          <ThumbsUp className="h-3 w-3" />
                          {post.upvotes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-destructive">
                          <ThumbsDown className="h-3 w-3" />
                          {post.downvotes || 0}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3 w-3" />
                          {post.view_count || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(post.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setDeletePost(post)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={!!deletePost} onOpenChange={() => setDeletePost(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deletePost?.title}"? This action cannot be undone and will also delete all associated replies.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deletePost && deleteMutation.mutate(deletePost.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};
