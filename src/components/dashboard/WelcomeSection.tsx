import { Card } from "@/components/ui/card";
import { Sparkles, Sun, Moon, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

export const WelcomeSection = () => {
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good Morning" : currentHour < 18 ? "Good Afternoon" : "Good Evening";
  const TimeIcon = currentHour < 6 || currentHour >= 18 ? Moon : Sun;
  const { user } = useAuth();
  const [userName, setUserName] = useState<string>("Farmer");

  useEffect(() => {
    const loadUserName = async () => {
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (data?.full_name) {
        setUserName(data.full_name.split(' ')[0]);
      }
    };

    loadUserName();
  }, [user]);
  
  return (
    <Card className="relative p-6 overflow-hidden border-0 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/10 blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Floating leaves */}
        <motion.div
          className="absolute top-4 right-20 text-primary/20"
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 10, 0],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Leaf className="h-8 w-8" />
        </motion.div>
        <motion.div
          className="absolute bottom-6 right-40 text-accent/30"
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, -15, 0],
            opacity: [0.2, 0.5, 0.2]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Leaf className="h-6 w-6" />
        </motion.div>
      </div>

      <div className="relative flex items-start justify-between">
        <div className="flex items-center gap-4">
          <motion.div 
            className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/70 shadow-lg"
            animate={{ 
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <TimeIcon className="h-8 w-8 text-primary-foreground" />
          </motion.div>
          <div>
            <motion.p 
              className="text-sm font-medium text-primary/80 mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {greeting}
            </motion.p>
            <motion.h1 
              className="text-3xl md:text-4xl font-heading font-bold"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-gradient">Welcome back,</span>{" "}
              <span className="text-foreground">{userName}!</span> 
              <motion.span 
                className="inline-block ml-2"
                animate={{ rotate: [0, 20, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                👋
              </motion.span>
            </motion.h1>
            <motion.p 
              className="text-muted-foreground mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Here's what's happening with your farm today
            </motion.p>
          </div>
        </div>
        <motion.div 
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 shadow-sm"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-4 w-4 text-accent" />
          </motion.div>
          <span className="text-sm font-medium text-foreground">AI Ready</span>
        </motion.div>
      </div>
    </Card>
  );
};
