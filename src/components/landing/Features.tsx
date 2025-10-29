import { Card } from "@/components/ui/card";
import { Leaf, CloudRain, Bug, Newspaper, Users, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Leaf,
    title: "Crop Recommendations",
    description: "AI-powered suggestions based on soil conditions, weather patterns, and regional data for optimal crop selection.",
  },
  {
    icon: CloudRain,
    title: "Weather Alerts",
    description: "Real-time weather updates and agricultural forecasts tailored to your farm's location.",
  },
  {
    icon: Bug,
    title: "Pest Diagnosis",
    description: "Upload photos for instant pest and disease identification with treatment recommendations.",
  },
  {
    icon: Newspaper,
    title: "Government Schemes",
    description: "Easy access to agricultural subsidies, loans, and government programs you qualify for.",
  },
  {
    icon: Users,
    title: "Community Forum",
    description: "Connect with fellow farmers, share experiences, and learn from agricultural experts.",
  },
  {
    icon: MessageSquare,
    title: "AI Chatbot",
    description: "Get instant answers to farming questions from our intelligent agricultural assistant.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            Everything You Need for
            <span className="text-primary"> Successful Farming</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools and insights to help you make informed decisions and maximize your farm's potential.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border bg-card"
            >
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
