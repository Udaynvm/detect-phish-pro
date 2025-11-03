import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PhishingCheckResult {
  verdict: 'safe' | 'phishing';
  confidence: number;
  reasons: string[];
}

function analyzeURL(url: string): PhishingCheckResult {
  const reasons: string[] = [];
  let riskScore = 0;

  try {
    // Normalize URL
    const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
    const urlObj = new URL(normalizedUrl);
    const hostname = urlObj.hostname.toLowerCase();

    // Check 1: IP address instead of domain name (high risk)
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      riskScore += 30;
      reasons.push('Uses IP address instead of domain name');
    }

    // Check 2: Excessive length (suspicious)
    if (normalizedUrl.length > 75) {
      riskScore += 15;
      reasons.push('URL is unusually long');
    }

    // Check 3: Suspicious TLDs
    const suspiciousTLDs = ['.tk', '.ml', '.ga', '.cf', '.gq', '.xyz', '.pw', '.cc'];
    if (suspiciousTLDs.some(tld => hostname.endsWith(tld))) {
      riskScore += 25;
      reasons.push('Uses suspicious top-level domain');
    }

    // Check 4: Multiple subdomains (can indicate impersonation)
    const subdomainCount = hostname.split('.').length - 2;
    if (subdomainCount > 2) {
      riskScore += 20;
      reasons.push('Contains excessive number of subdomains');
    }

    // Check 5: Suspicious keywords in URL
    const suspiciousKeywords = [
      'verify', 'account', 'update', 'secure', 'banking', 'paypal',
      'login', 'signin', 'confirm', 'suspend', 'restricted'
    ];
    const urlLower = normalizedUrl.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter(keyword => urlLower.includes(keyword));
    if (foundKeywords.length > 0) {
      riskScore += foundKeywords.length * 10;
      reasons.push(`Contains suspicious keywords: ${foundKeywords.join(', ')}`);
    }

    // Check 6: HTTPS presence (lack of HTTPS is suspicious)
    if (urlObj.protocol !== 'https:') {
      riskScore += 20;
      reasons.push('Does not use secure HTTPS protocol');
    }

    // Check 7: Special characters that could indicate obfuscation
    const specialCharCount = (normalizedUrl.match(/[@\-_]/g) || []).length;
    if (specialCharCount > 4) {
      riskScore += 15;
      reasons.push('Contains excessive special characters');
    }

    // Check 8: Known legitimate domains (whitelist)
    const legitimateDomains = [
      'google.com', 'facebook.com', 'amazon.com', 'microsoft.com',
      'apple.com', 'twitter.com', 'linkedin.com', 'github.com',
      'stackoverflow.com', 'wikipedia.org', 'youtube.com'
    ];
    
    const isLegitimate = legitimateDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );

    if (isLegitimate) {
      riskScore = Math.max(0, riskScore - 50);
      reasons.push('Domain is from a well-known legitimate service');
    }

    // Determine verdict based on risk score
    const confidence = Math.min(95, Math.max(60, riskScore > 50 ? riskScore : 100 - riskScore));
    
    if (riskScore >= 40) {
      return {
        verdict: 'phishing',
        confidence,
        reasons: reasons.length > 0 ? reasons : ['Multiple phishing indicators detected']
      };
    } else {
      return {
        verdict: 'safe',
        confidence,
        reasons: reasons.length > 0 ? reasons : ['No significant phishing indicators found']
      };
    }

  } catch (error) {
    console.error('Error analyzing URL:', error);
    return {
      verdict: 'phishing',
      confidence: 75,
      reasons: ['Invalid URL format or unable to parse']
    };
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Parse request body
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Checking URL:', url);

    // Analyze the URL
    const result = analyzeURL(url);

    console.log('Analysis result:', result);

    // Store the result in the database
    const { data: checkData, error: dbError } = await supabase
      .from('url_checks')
      .insert({
        url,
        verdict: result.verdict,
        confidence: result.confidence,
        reasons: result.reasons
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Stored check result:', checkData);

    // Return the result
    return new Response(
      JSON.stringify({
        id: checkData.id,
        url: checkData.url,
        verdict: checkData.verdict,
        confidence: checkData.confidence,
        reasons: checkData.reasons,
        checked_at: checkData.checked_at
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in check-url function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
