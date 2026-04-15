import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export const CTA = () => {
  return (
    <section className="py-12 sm:py-20 px-4 bg-white/95 backdrop-blur-sm overflow-hidden" style={{ perspective: "1000px" }}>
      <div className="container mx-auto">
        <motion.div
          className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-6"
          initial={{ opacity: 0, rotateX: -20, y: 60 }}
          whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-base sm:text-xl text-muted-foreground px-2">
            Join thousands of farmers using AI-powered insights to grow better crops and increase profits.
          </p>
          <motion.div
            className="flex justify-center pt-2 sm:pt-4"
            whileHover={{ scale: 1.05, z: 30 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Button 
              size="lg" 
              className="text-base sm:text-lg h-10 sm:h-12 px-6 sm:px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_30px_hsl(var(--primary)/0.3)] hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] transition-shadow duration-300"
              asChild
            >
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
