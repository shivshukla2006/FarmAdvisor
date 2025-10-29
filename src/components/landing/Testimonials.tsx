import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Maharashtra",
    initials: "RK",
    quote: "FarmAdvisor helped me increase my crop yield by 40% with their AI recommendations. The weather alerts saved my crops during unexpected rains.",
  },
  {
    name: "Lakshmi Devi",
    location: "Tamil Nadu",
    initials: "LD",
    quote: "The pest diagnosis feature is amazing! I can now identify diseases early and take action. It's like having an expert in my pocket.",
  },
  {
    name: "Harjit Singh",
    location: "Punjab",
    initials: "HS",
    quote: "I discovered government schemes I never knew existed. Got a subsidy for drip irrigation that saved me lakhs of rupees.",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Trusted by Farmers
            <span className="text-primary"> Across India</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of farmers who are already transforming their agricultural practices.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 relative bg-card border-border">
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <div className="mb-4">
                <Avatar className="h-12 w-12 mb-3">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-heading font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                </div>
              </div>
              <p className="text-muted-foreground italic">"{testimonial.quote}"</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
