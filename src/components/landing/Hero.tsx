import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);

  return (
    <section ref={ref} className="relative pt-20 sm:pt-32 pb-10 sm:pb-20 px-4 bg-black/50 overflow-hidden" style={{ perspective: "1200px" }}>
      {/* Floating 3D particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/20 backdrop-blur-sm border border-primary/10"
          style={{
            width: 20 + i * 12,
            height: 20 + i * 12,
            left: `${10 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15 * (i % 2 === 0 ? 1 : -1), 0],
            rotateX: [0, 360],
            rotateY: [0, 180],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}

      {/* Glowing orbs */}
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl"
        style={{ top: "10%", right: "-5%" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-accent/10 blur-3xl"
        style={{ bottom: "10%", left: "-3%" }}
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div className="container mx-auto relative z-10" style={{ y, opacity, scale }}>
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-8">
          <motion.div
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 30, rotateX: -20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">AI-Powered Agricultural Intelligence</span>
          </motion.div>
          
          <motion.h1
            className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white"
            initial={{ opacity: 0, y: 50, rotateX: -15 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            Smart Farming,
            <motion.span
              className="text-primary inline-block"
              animate={{ rotateY: [0, 5, 0, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {" "}Better Yields
            </motion.span>
          </motion.h1>
          
          <motion.p
            className="text-sm sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto px-2"
            initial={{ opacity: 0, y: 40, rotateX: -10 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          >
            Get personalized crop recommendations, real-time weather alerts, pest diagnosis, 
            and access to government schemes - all in one platform designed for Indian farmers.
          </motion.p>
          
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8, z: -50 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            transition={{ duration: 0.7, delay: 0.6, type: "spring", stiffness: 200 }}
          >
            <Button size="lg" className="text-base sm:text-lg h-10 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.6)] transition-shadow duration-300" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            className="pt-4 sm:pt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-white/70"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {["No credit card required", "Available in 4+ languages", "Trusted by 10,000+ farmers"].map((text, i) => (
              <motion.div
                key={i}
                className="flex items-center justify-center gap-2"
                whileHover={{ scale: 1.1, z: 20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-2 w-2 rounded-full bg-primary"></div>
                <span>{text}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};
