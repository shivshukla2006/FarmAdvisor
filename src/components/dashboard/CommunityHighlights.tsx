import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const discussions = [
  {
    title: "Best practices for organic farming",
    replies: 24,
    time: "3 hours ago",
  },
  {
    title: "Drip irrigation setup guide",
    replies: 18,
    time: "1 day ago",
  },
  {
    title: "Rice pest control tips",
    replies: 31,
    time: "2 days ago",
  },
];

export const CommunityHighlights = () => {
  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-heading font-semibold">Community Highlights</h2>
        <Link to="/community">
          <Button variant="ghost" size="sm">
            View All
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
      
      <div className="space-y-3">
        {discussions.map((discussion, index) => (
          <Link
            key={index}
            to="/community"
            className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="font-medium text-sm mb-1">{discussion.title}</div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{discussion.replies} replies</span>
              </div>
              <span>•</span>
              <span>{discussion.time}</span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
};
