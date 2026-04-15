import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  { name: "Rajesh Kumar", location: "Maharashtra", initials: "RK", quote: "FarmAdvisor helped me increase my crop yield by 40% with their AI recommendations. The weather alerts saved my crops during unexpected rains." },
  { name: "Lakshmi Devi", location: "Tamil Nadu", initials: "LD", quote: "The pest diagnosis feature is amazing! I can now identify diseases early and take action. It is like having an expert in my pocket." },
  { name: "Harjit Singh", location: "Punjab", initials: "HS", quote: "I discovered government schemes I never knew existed. Got a subsidy for drip irrigation that saved me lakhs of rupees." },
];

export const Testimonials = () => {
  return (
    <section className="py-12 sm:py-20 px-4 bg-black/60 overflow-hidden" style={{ perspective: "1200px" }}>
      <div className="container mx-auto">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-16"
          initial={{ opacity: 0, z: -100, rotateX: -15 }}
          whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-heading font-bold mb-3 sm:mb-4 text-white">
            Trusted by Farmers
            <span className="text-primary"> Across India</span>
          </h2>
          <p className="text-sm sm:text-lg text-white/80 px-2">
            Join thousands of farmers who are already transforming their agricultural practices.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80, rotateY: index === 0 ? 15 : index === 2 ? -15 : 0, rotateX: -10 }}
              whileInView={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: index * 0.15, type: "spring", stiffness: 100 }}
              whileHover={{
                z: 50,
                rotateY: index === 0 ? -5 : index === 2 ? 5 : 0,
                scale: 1.03,
                transition: { duration: 0.3 },
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="p-6 relative bg-white/95 backdrop-blur-sm border-white/20 h-full hover:shadow-[0_25px_60px_-15px_hsl(var(--primary)/0.3)] transition-shadow duration-300">
                <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
                <div className="mb-4" style={{ transform: "translateZ(20px)" }}>
                  <Avatar className="h-12 w-12 mb-3">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-heading font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic" style={{ transform: "translateZ(10px)" }}>
                  "{testimonial.quote}"
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
