import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Hero = () => {
  return (
    <section className="pt-20 sm:pt-32 pb-10 sm:pb-20 px-4 bg-black/50">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-8">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">AI-Powered Agricultural Intelligence</span>
          </div>
          
          <h1 className="text-2xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight text-white">
            Smart Farming,
            <span className="text-primary"> Better Yields</span>
          </h1>
          
          <p className="text-sm sm:text-xl md:text-2xl text-white/80 max-w-2xl mx-auto px-2">
            Get personalized crop recommendations, real-time weather alerts, pest diagnosis, 
            and access to government schemes - all in one platform designed for Indian farmers.
          </p>
          
          <div className="flex justify-center">
            <Button size="lg" className="text-base sm:text-lg h-10 sm:h-12 px-6 sm:px-8 bg-primary hover:bg-primary/90" asChild>
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
          </div>
          
          <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-8 text-xs sm:text-sm text-white/70">
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>No credit card required</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Available in 4+ languages</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary"></div>
              <span>Trusted by 10,000+ farmers</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
