import { useState, useEffect } from "react";
import { Shield, Download, RefreshCw, Filter } from "lucide-react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface URLCheck {
  id: string;
  url: string;
  verdict: string;
  confidence: number;
  checked_at: string;
}

const Admin = () => {
  const [checks, setChecks] = useState<URLCheck[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecks();
  }, [filter]);

  const fetchChecks = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('url_checks')
        .select('*')
        .order('checked_at', { ascending: false })
        .limit(50);

      if (filter !== 'all') {
        query = query.eq('verdict', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setChecks(data || []);
    } catch (error) {
      console.error('Error fetching checks:', error);
      toast.error("Failed to load URL checks");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    const csv = [
      ['URL', 'Verdict', 'Confidence', 'Checked At'].join(','),
      ...checks.map(check => 
        [check.url, check.verdict, check.confidence, check.checked_at].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-logs-${new Date().toISOString()}.csv`;
    a.click();
    toast.success("CSV downloaded successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="rounded-lg bg-gradient-hero p-2">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            View and manage all URL checks performed on PhishGuard
          </p>
        </div>

        {/* Controls */}
        <Card className="p-6 mb-6 shadow-card">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select value={filter} onValueChange={setFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by verdict" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Checks</SelectItem>
                    <SelectItem value="safe">Safe Only</SelectItem>
                    <SelectItem value="phishing">Phishing Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchChecks}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={downloadCSV}
              disabled={checks.length === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Download CSV
            </Button>
          </div>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6 shadow-card">
            <div className="text-sm text-muted-foreground mb-1">Total Checks</div>
            <div className="text-3xl font-bold">{checks.length}</div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-sm text-muted-foreground mb-1">Safe URLs</div>
            <div className="text-3xl font-bold text-success">
              {checks.filter(c => c.verdict === 'safe').length}
            </div>
          </Card>
          <Card className="p-6 shadow-card">
            <div className="text-sm text-muted-foreground mb-1">Phishing URLs</div>
            <div className="text-3xl font-bold text-destructive">
              {checks.filter(c => c.verdict === 'phishing').length}
            </div>
          </Card>
        </div>

        {/* Checks Table */}
        <Card className="shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left">
                  <th className="p-4 font-semibold">URL</th>
                  <th className="p-4 font-semibold">Verdict</th>
                  <th className="p-4 font-semibold">Confidence</th>
                  <th className="p-4 font-semibold">Checked At</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      Loading...
                    </td>
                  </tr>
                ) : checks.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-muted-foreground">
                      No checks found
                    </td>
                  </tr>
                ) : (
                  checks.map((check) => (
                    <tr key={check.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="p-4 max-w-md truncate">{check.url}</td>
                      <td className="p-4">
                        <Badge
                          variant={check.verdict === 'safe' ? 'default' : 'destructive'}
                          className={check.verdict === 'safe' ? 'bg-success' : ''}
                        >
                          {check.verdict}
                        </Badge>
                      </td>
                      <td className="p-4">{check.confidence}%</td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {new Date(check.checked_at).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
