import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { Sprout } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import cropsBg from "@/assets/crops-bg.jpg";

const Auth = () => {
  const [activeTab, setActiveTab] = useState<string>("login");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-4 py-12 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${cropsBg})` }}
    >
      <div className="w-full max-w-md">
      <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="font-heading font-bold text-2xl text-white">FarmAdvisor</span>
          </Link>
          <h1 className="text-3xl font-heading font-bold mb-2 text-white">Welcome Back</h1>
          <p className="text-white/80">Sign in to access your farm dashboard</p>
        </div>

        <Card className="p-6 bg-card border-border">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSuccess={() => setActiveTab("login")} />
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-white/70 mt-4">
          By continuing, you agree to our{" "}
          <a href="#" className="text-white hover:underline">Terms of Service</a>
          {" "}and{" "}
          <a href="#" className="text-white hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Auth;
