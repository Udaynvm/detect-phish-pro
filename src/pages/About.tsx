import { Shield, AlertTriangle, Lock, Zap, Target, Eye } from "lucide-react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Shield className="h-4 w-4" />
            About PhishGuard
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Protecting You from{" "}
            <span className="bg-gradient-danger bg-clip-text text-transparent">
              Phishing Attacks
            </span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Learn about phishing threats and how our detection system keeps you safe
          </p>
        </div>

        {/* What is Phishing */}
        <Card className="p-8 mb-8 shadow-card">
          <div className="flex items-start gap-4 mb-4">
            <div className="rounded-lg bg-destructive/10 p-3">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">What is Phishing?</h2>
              <p className="text-muted-foreground mb-4">
                Phishing is a type of cyber attack where criminals create fake websites that look like legitimate ones 
                to steal your personal information, passwords, credit card details, or other sensitive data.
              </p>
              <p className="text-muted-foreground">
                These attacks often come through emails, text messages, or social media, trying to trick you into 
                clicking malicious links and entering your information on fake login pages.
              </p>
            </div>
          </div>
        </Card>

        {/* Common Signs */}
        <Card className="p-8 mb-8 shadow-card">
          <h2 className="text-2xl font-bold mb-6">Common Signs of Phishing</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Suspicious or misspelled URLs",
              "Requests for personal information",
              "Urgent or threatening language",
              "Unexpected emails or messages",
              "Poor grammar and spelling",
              "Suspicious attachments or links"
            ].map((sign, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <span className="text-sm">{sign}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* How PhishGuard Works */}
        <Card className="p-8 mb-8 shadow-card">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="h-6 w-6 text-accent" />
            How PhishGuard Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold">
                1
              </div>
              <div>
                <h3 className="font-semibold mb-2">URL Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  We analyze the URL structure, looking for suspicious patterns, IP addresses in hostnames, 
                  and common phishing indicators.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold">
                2
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pattern Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Our algorithms detect common phishing techniques like homograph attacks, subdomain spoofing, 
                  and suspicious TLDs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-white font-semibold">
                3
              </div>
              <div>
                <h3 className="font-semibold mb-2">Risk Scoring</h3>
                <p className="text-sm text-muted-foreground">
                  Each URL receives a confidence score based on multiple factors, giving you a clear 
                  understanding of the threat level.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Disclaimer */}
        <Card className="p-6 bg-muted/50 border-warning/50">
          <div className="flex gap-3">
            <Eye className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Disclaimer</h3>
              <p className="text-sm text-muted-foreground">
                PhishGuard is a detection tool designed to help identify potential phishing threats. While our 
                system uses advanced heuristics, no automated system is 100% accurate. Always exercise caution 
                when entering personal information online, verify website authenticity, and use common sense. 
                PhishGuard should be used as one of several security measures to protect yourself online.
              </p>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Ready to check a URL?</p>
          <Button asChild size="lg" className="bg-gradient-hero hover:opacity-90">
            <Link to="/">
              <Shield className="mr-2 h-5 w-5" />
              Start Checking URLs
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default About;
