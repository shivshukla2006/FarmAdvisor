import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Testimonials } from "@/components/landing/Testimonials";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";
import { InstallPrompt } from "@/components/InstallPrompt";
import cropsBg from "@/assets/crops-bg.jpg";

const Index = () => {
  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${cropsBg})` }}
    >
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
      <InstallPrompt />
    </div>
  );
};

export default Index;
