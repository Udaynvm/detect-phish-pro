import { useLocation, useNavigate, Link } from "react-router-dom";
import { Shield, AlertTriangle, CheckCircle2, XCircle, ArrowLeft, Flag, Share2 } from "lucide-react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface CheckData {
  id: string;
  url: string;
  verdict: 'safe' | 'phishing';
  confidence: number;
  reasons: string[];
}

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkData = location.state?.checkData as CheckData | undefined;

  if (!checkData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <p className="text-muted-foreground mb-4">No check results found</p>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const isPhishing = checkData.verdict === 'phishing';

  const handleShare = () => {
    const shareText = `I checked ${checkData.url} on PhishGuard - Result: ${checkData.verdict.toUpperCase()}`;
    if (navigator.share) {
      navigator.share({
        title: 'PhishGuard Check Result',
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success("Result copied to clipboard!");
    }
  };

  const handleReport = () => {
    toast.success("Report submitted. Thank you for helping keep the web safe!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Check Another URL
        </Button>

        <Card className={`p-8 shadow-xl ${isPhishing ? 'border-destructive/50' : 'border-success/50'}`}>
          {/* Verdict Badge */}
          <div className="text-center mb-8">
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-semibold mb-4 ${
              isPhishing 
                ? 'bg-gradient-danger text-white' 
                : 'bg-gradient-safe text-white'
            }`}>
              {isPhishing ? (
                <>
                  <XCircle className="h-6 w-6" />
                  Phishing Detected
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-6 w-6" />
                  Safe
                </>
              )}
            </div>
            
            <h2 className="text-2xl font-bold mb-2 break-all">{checkData.url}</h2>
            
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Badge variant="secondary" className="text-base">
                {checkData.confidence}% sure
              </Badge>
            </div>
          </div>

          {/* Reasons */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {isPhishing ? (
                <AlertTriangle className="h-5 w-5 text-destructive" />
              ) : (
                <Shield className="h-5 w-5 text-success" />
              )}
              Detection Reasons
            </h3>
            <ul className="space-y-2">
              {checkData.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full flex-shrink-0 ${
                    isPhishing ? 'bg-destructive' : 'bg-success'
                  }`} />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 justify-center pt-6 border-t">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="gap-2"
            >
              <Shield className="h-4 w-4" />
              Check Another URL
            </Button>
            <Button
              onClick={handleReport}
              variant="outline"
              className="gap-2"
            >
              <Flag className="h-4 w-4" />
              Report if Wrong
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </Card>

        {/* Info Box */}
        <Card className="mt-6 p-6 bg-muted/50">
          <h3 className="font-semibold mb-2">What should I do?</h3>
          <p className="text-sm text-muted-foreground">
            {isPhishing ? (
              <>
                ⚠️ This URL shows signs of phishing. <strong>Do not</strong> enter any personal information, 
                passwords, or financial details. Close the website immediately and report it if you received 
                it via email or message.
              </>
            ) : (
              <>
                ✓ This URL appears safe based on our analysis. However, always exercise caution when entering 
                sensitive information online. Verify the website's authenticity and look for HTTPS in the address bar.
              </>
            )}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Result;
