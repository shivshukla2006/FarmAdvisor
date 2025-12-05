import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const CTA = () => {
  return (
    <section className="py-20 px-4 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join thousands of farmers using AI-powered insights to grow better crops and increase profits.
          </p>
          <div className="flex justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg h-12 px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              asChild
            >
              <Link to="/auth">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
