import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Info, Clock, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const activities = [
  {
    icon: CheckCircle2,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    title: "Crop recommendation saved",
    time: "2 hours ago",
  },
  {
    icon: AlertCircle,
    iconColor: "text-accent",
    bgColor: "bg-accent/10",
    title: "Weather alert received",
    time: "5 hours ago",
  },
  {
    icon: Info,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    title: "New scheme notification",
    time: "1 day ago",
  },
  {
    icon: CheckCircle2,
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    title: "Profile updated successfully",
    time: "2 days ago",
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

export const RecentActivity = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="flex items-center gap-2 mb-5">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Clock className="h-5 w-5 text-muted-foreground" />
        </motion.div>
        <h2 className="text-xl font-heading font-semibold">Recent Activity</h2>
      </div>
      
      <motion.div 
        className="space-y-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.map((activity, index) => (
          <motion.div 
            key={index} 
            variants={itemVariants}
            className="group flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all duration-200 cursor-pointer"
            whileHover={{ x: 4 }}
          >
            <motion.div 
              className={`flex-shrink-0 p-2 rounded-lg ${activity.bgColor}`}
              whileHover={{ scale: 1.1 }}
            >
              <activity.icon className={`h-4 w-4 ${activity.iconColor}`} />
            </motion.div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};
