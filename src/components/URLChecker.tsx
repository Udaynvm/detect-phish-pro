import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const URLChecker = () => {
  const [url, setUrl] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const navigate = useNavigate();

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      toast.error("Please enter a URL to check");
      return;
    }

    // Basic URL validation
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
    } catch {
      toast.error("Please enter a valid URL");
      return;
    }

    setIsChecking(true);

    try {
      const { data, error } = await supabase.functions.invoke('check-url', {
        body: { url }
      });

      if (error) throw error;

      // Navigate to results page with the check data
      navigate('/result', { state: { checkData: data } });
    } catch (error) {
      console.error('Error checking URL:', error);
      toast.error("Failed to check URL. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleCheck} className="relative">
        <div className="relative group">
          <Input
            type="text"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 pl-12 pr-32 text-lg shadow-card transition-all focus:shadow-glow"
            disabled={isChecking}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Button
            type="submit"
            disabled={isChecking}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-hero hover:opacity-90 transition-opacity"
          >
            {isChecking ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Now"
            )}
          </Button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground mt-3 text-center">
        Example: <button onClick={() => setUrl("https://example.com")} className="text-accent hover:underline">https://example.com</button>
      </p>
    </div>
  );
};

export default URLChecker;
