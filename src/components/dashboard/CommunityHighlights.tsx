import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight, Users, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const discussions = [
  {
    title: "Best practices for organic farming",
    replies: 24,
    time: "3 hours ago",
    hot: true,
  },
  {
    title: "Drip irrigation setup guide",
    replies: 18,
    time: "1 day ago",
    hot: false,
  },
  {
    title: "Rice pest control tips",
    replies: 31,
    time: "2 days ago",
    hot: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const CommunityHighlights = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/5 to-transparent rounded-bl-full" />
      
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Users className="h-5 w-5 text-primary" />
          </motion.div>
          <h2 className="text-xl font-heading font-semibold">Community</h2>
        </div>
        <Link to="/community">
          <Button variant="ghost" size="sm" className="group">
            View All
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
      
      <motion.div 
        className="space-y-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {discussions.map((discussion, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link
              to="/community"
              className="group block p-3 rounded-lg hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-1">
                      {discussion.title}
                    </span>
                    {discussion.hot && (
                      <motion.span 
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <TrendingUp className="h-2.5 w-2.5" />
                        Hot
                      </motion.span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      <span>{discussion.replies} replies</span>
                    </div>
                    <span>•</span>
                    <span>{discussion.time}</span>
                  </div>
                </div>
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{ x: 2 }}
                >
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};
