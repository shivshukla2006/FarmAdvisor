import { Card } from "@/components/ui/card";
import { Leaf, CloudRain, Bug, Newspaper, Users, MessageSquare } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const features = [
  { icon: Leaf, title: "Crop Recommendations", description: "AI-powered suggestions based on soil conditions, weather patterns, and regional data for optimal crop selection." },
  { icon: CloudRain, title: "Weather Alerts", description: "Real-time weather updates and agricultural forecasts tailored to your farm's location." },
  { icon: Bug, title: "Pest Diagnosis", description: "Upload photos for instant pest and disease identification with treatment recommendations." },
  { icon: Newspaper, title: "Government Schemes", description: "Easy access to agricultural subsidies, loans, and government programs you qualify for." },
  { icon: Users, title: "Community Forum", description: "Connect with fellow farmers, share experiences, and learn from agricultural experts." },
  { icon: MessageSquare, title: "AI Chatbot", description: "Get instant answers to farming questions from our intelligent agricultural assistant." },
];

const TiltCard = ({ children, index }: { children: React.ReactNode; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: "800px" }}
      initial={{ opacity: 0, y: 60, rotateX: -15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="relative"
    >
      {/* Glare overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-lg z-10"
        style={{
          background: useTransform(
            [glareX, glareY],
            ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, hsl(var(--primary) / 0.15) 0%, transparent 60%)`
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

export const Features = () => {
  return (
    <section className="py-12 sm:py-20 px-4 bg-white/95 backdrop-blur-sm" style={{ perspective: "1200px" }}>
      <div className="container mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-16"
          initial={{ opacity: 0, y: 40, rotateX: -10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-4 text-foreground">
            Everything You Need for
            <span className="text-primary"> Successful Farming</span>
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground px-2">
            Comprehensive tools and insights to help you make informed decisions and maximize your farm's potential.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <TiltCard key={index} index={index}>
              <Card className="p-4 sm:p-6 border-border bg-card h-full transition-shadow duration-300 hover:shadow-[0_20px_60px_-15px_hsl(var(--primary)/0.25)]">
                <motion.div
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3 sm:mb-4"
                  style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}
                >
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </motion.div>
                <h3
                  className="text-lg sm:text-xl font-heading font-semibold mb-1.5 sm:mb-2 text-card-foreground"
                  style={{ transform: "translateZ(30px)" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-sm sm:text-base text-muted-foreground"
                  style={{ transform: "translateZ(20px)" }}
                >
                  {feature.description}
                </p>
              </Card>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};
