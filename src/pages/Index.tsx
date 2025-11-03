import { Shield, Lock, TrendingUp, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import URLChecker from "@/components/URLChecker";
import { Card } from "@/components/ui/card";

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Real-time Detection",
      description: "Instantly analyze URLs for phishing threats using advanced heuristics"
    },
    {
      icon: Lock,
      title: "Secure Analysis",
      description: "Your data is protected with enterprise-grade security measures"
    },
    {
      icon: TrendingUp,
      title: "Detailed Reports",
      description: "Get comprehensive analysis with confidence scores and reasoning"
    },
    {
      icon: AlertTriangle,
      title: "Report Threats",
      description: "Help protect others by reporting suspicious URLs you encounter"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container relative py-20 md:py-32">
          <div className="text-center space-y-6 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              <Shield className="h-4 w-4" />
              Protect Yourself from Phishing
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Check if a Website is{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Safe
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              PhishGuard uses advanced detection algorithms to analyze URLs and protect you from phishing attacks in real-time.
            </p>
            
            <div className="pt-8">
              <URLChecker />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose PhishGuard?</h2>
            <p className="text-muted-foreground">
              Comprehensive protection against phishing threats
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 shadow-card hover:shadow-xl transition-shadow">
                <div className="rounded-lg bg-gradient-hero/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                99.9%
              </div>
              <div className="text-muted-foreground">Detection Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                &lt;1s
              </div>
              <div className="text-muted-foreground">Average Check Time</div>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <div className="text-muted-foreground">Protection Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
