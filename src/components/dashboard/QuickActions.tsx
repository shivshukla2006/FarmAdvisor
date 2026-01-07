import { Card } from "@/components/ui/card";
import { Leaf, Bug, Newspaper, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const actions = [
  {
    icon: Leaf,
    title: "Get Crop Recommendations",
    description: "AI-powered suggestions for your farm",
    path: "/recommendations",
    gradient: "from-primary/20 via-primary/10 to-transparent",
    iconGradient: "from-primary to-primary/60",
    hoverGlow: "hover:shadow-primary/20",
  },
  {
    icon: Bug,
    title: "Diagnose Pest Issues",
    description: "Upload photo for instant analysis",
    path: "/pest-diagnosis",
    gradient: "from-secondary/20 via-secondary/10 to-transparent",
    iconGradient: "from-secondary to-secondary/60",
    hoverGlow: "hover:shadow-secondary/20",
  },
  {
    icon: Newspaper,
    title: "Browse Gov Schemes",
    description: "Find subsidies and programs",
    path: "/schemes",
    gradient: "from-accent/20 via-accent/10 to-transparent",
    iconGradient: "from-accent to-accent/60",
    hoverGlow: "hover:shadow-accent/20",
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
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const QuickActions = () => {
  return (
    <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full" />
      
      <div className="flex items-center gap-2 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="h-5 w-5 text-primary" />
        </motion.div>
        <h2 className="text-xl font-heading font-semibold">Quick Actions</h2>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {actions.map((action, index) => (
          <motion.div key={action.path} variants={itemVariants}>
            <Link
              to={action.path}
              className={`group relative block p-5 rounded-xl border border-border/50 bg-gradient-to-br ${action.gradient} hover:border-primary/30 transition-all duration-300 ${action.hoverGlow} hover:shadow-lg overflow-hidden`}
            >
              {/* Hover glow effect */}
              <motion.div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, hsl(var(--primary) / 0.1) 0%, transparent 60%)'
                }}
              />
              
              <div className="relative">
                <motion.div 
                  className={`h-14 w-14 rounded-xl bg-gradient-to-br ${action.iconGradient} flex items-center justify-center mb-4 shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <action.icon className="h-7 w-7 text-primary-foreground" />
                </motion.div>
                
                <h3 className="font-heading font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {action.description}
                </p>
                
                <div className="flex items-center text-sm text-primary font-medium">
                  <span>Get started</span>
                  <motion.div
                    className="ml-2"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  >
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </div>
              </div>
              
              {/* Corner decoration */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-tl from-primary/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </Card>
  );
};
