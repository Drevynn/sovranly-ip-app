'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Play, 
  Check, 
  Copy, 
  RotateCcw, 
  Code, 
  Terminal, 
  Send, 
  Key, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Clock, 
  Database, 
  Search, 
  Download, 
  Trash2, 
  ChevronRight, 
  ChevronDown, 
  Sliders, 
  Eye, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/components/auth/FirebaseProvider';

export interface EndpointDefinition {
  id: string;
  category: 'Assets' | 'Royalties' | 'Permissions' | 'Verification' | 'Developer';
  title: string;
  description: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  requiresAuth: boolean;
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Array<{ key: string; value: string; enabled: boolean; description?: string }>;
  defaultPayload?: string;
  payloadDescription?: string;
}

export const SOVRANLY_ENDPOINTS: EndpointDefinition[] = [
  {
    id: 'get-assets-catalog',
    category: 'Assets',
    title: 'List Public Verified Catalog',
    description: 'Query verified public intellectual property assets, license availability, and cryptographic fingerprint hashes.',
    method: 'GET',
    path: '/api/assets',
    requiresAuth: false,
    defaultQueryParams: [
      { key: 'scope', value: 'marketplace', enabled: true, description: 'Scope of assets: marketplace | all | mine' }
    ]
  },
  {
    id: 'get-assets-creator',
    category: 'Assets',
    title: 'Query Creator Private Catalog',
    description: 'Retrieve the authenticated creator’s registered IP masters, notarized timestamp hashes, and royalty split records.',
    method: 'GET',
    path: '/api/assets',
    requiresAuth: true,
    defaultQueryParams: [
      { key: 'scope', value: 'mine', enabled: true, description: 'Retrieve assets owned by authenticated identity' }
    ]
  },
  {
    id: 'post-assets-register',
    category: 'Assets',
    title: 'Register & Notarize Master IP',
    description: 'Submit an original intellectual property asset for cryptographic notarization and smart contract catalog inclusion.',
    method: 'POST',
    path: '/api/assets',
    requiresAuth: true,
    payloadDescription: 'Asset title, category type, licensing tier, custom royalty rate (up to 95%), and optional media metadata.',
    defaultPayload: JSON.stringify({
      title: "Neon Horizon Cinematic Audio Master (96kHz)",
      type: "Music / Audio",
      folder: "Master Recordings",
      tags: ["Synthwave", "Cyberpunk", "Cinematic", "Sync-Ready"],
      royalty: 85,
      license: "Commercial Digital Sync License (Class 42 Protected)",
      description: "Original analog synthesizer composition with full stems and zero-trust timestamp clearance.",
      price: 0.25,
      isForSale: true,
      duration: "3 Years",
      usages: ["Streaming & Broadcasting", "Derivative Works", "Commercial Sponsorships"],
      customClause: "Creator retains 85% primary royalty allocation disbursed trustlessly via continuous smart contract."
    }, null, 2)
  },
  {
    id: 'get-royalties-history',
    category: 'Royalties',
    title: 'Fetch 85/15 Royalty Split Ledger',
    description: 'Retrieve historical and pending royalty settlement disbursements, automated 85% creator distributions, and protocol fees.',
    method: 'GET',
    path: '/api/royalties',
    requiresAuth: true,
    defaultQueryParams: []
  },
  {
    id: 'post-royalties-record',
    category: 'Royalties',
    title: 'Record Royalty Settlement Event',
    description: 'Disburse and record an incoming sync license royalty settlement into the immutable zero-trust ledger.',
    method: 'POST',
    path: '/api/royalties',
    requiresAuth: true,
    payloadDescription: 'License reference, gross amount, currency, and royalty division parameters.',
    defaultPayload: JSON.stringify({
      licenseId: "svip-agr-005",
      assetId: "svip-market-001",
      assetTitle: "Sovereign Modular Synth Loop Pack Vol. 1",
      payerName: "Universal Media Sync Syndicate",
      payerPlatform: "Independent Film Score Synchronization",
      grossAmount: 1.5,
      currency: "ETH",
      royaltyRate: 85,
      notes: "Synchronized license fee settlement for indie film background score."
    }, null, 2)
  },
  {
    id: 'get-permissions-list',
    category: 'Permissions',
    title: 'Query Sync Clearance Permissions',
    description: 'Query active content clearance permissions, grantee credentials, and YouTube/TikTok attribution verification hashes.',
    method: 'GET',
    path: '/api/permissions',
    requiresAuth: true,
    defaultQueryParams: []
  },
  {
    id: 'post-permissions-grant',
    category: 'Permissions',
    title: 'Issue Instant Content Clearance',
    description: 'Issue a cryptographic synchronization permission code (e.g. YouTube, TikTok, Podcasts) with verifiable proof.',
    method: 'POST',
    path: '/api/permissions',
    requiresAuth: true,
    payloadDescription: 'Grantee identification, target social platform, project URL, and clearance scope.',
    defaultPayload: JSON.stringify({
      assetId: "svip-market-001",
      assetTitle: "Sovereign Modular Synth Loop Pack Vol. 1",
      granteeName: "Creative Media Studio",
      granteeSocialHandle: "@creativemedia (YouTube)",
      projectTitle: "Neo-Tokyo Cyberpunk Documentary Episode 1",
      projectUrl: "https://youtube.com/watch?v=sample-pilot-01",
      platform: "YouTube",
      scopeType: "YOUTUBE_VIDEO",
      scopeTitle: "YouTube Long-Form Video (Sync Clearance)",
      pricingType: "FREE_ATTRIBUTION",
      feeAmount: 0,
      currency: "USD",
      notes: "Instant clearance issued via Sovranly Zero-Trust API with automated ContentID whitelist."
    }, null, 2)
  },
  {
    id: 'get-certificate-verify',
    category: 'Verification',
    title: 'Cryptographic Certificate Verification',
    description: 'Public cryptographic proof-of-existence lookup validating SHA-256 fingerprint authenticity and timestamp status.',
    method: 'GET',
    path: '/api/certificates/verify/PRM-4821-9304',
    requiresAuth: false,
    defaultQueryParams: []
  },
  {
    id: 'get-transactions-ledger',
    category: 'Verification',
    title: 'Query Smart Contract Audit Ledger',
    description: 'Fetch recent blockchain transaction hashes, consensus block heights, and zero-trust audit proofs.',
    method: 'GET',
    path: '/api/transactions',
    requiresAuth: false,
    defaultQueryParams: []
  },
  {
    id: 'get-developer-key',
    category: 'Developer',
    title: 'Query Developer API Key Status',
    description: 'Check active developer access key state, masked token prefix, and latest rotation timestamp.',
    method: 'GET',
    path: '/api/developer/key',
    requiresAuth: true,
    defaultQueryParams: [
      { key: 'uid', value: 'sandbox-guest-agent-007', enabled: true, description: 'Target developer UID' }
    ]
  },
  {
    id: 'post-developer-rotate',
    category: 'Developer',
    title: 'Rotate Developer API Access Token',
    description: 'Generate a new high-entropy zero-trust bearer token and invalidate superseded cryptographic credentials.',
    method: 'POST',
    path: '/api/developer/rotate',
    requiresAuth: true,
    payloadDescription: 'Target email and developer UID for key regeneration.',
    defaultPayload: JSON.stringify({
      uid: "sandbox-guest-agent-007",
      email: "create@sovranlyip.com"
    }, null, 2)
  }
];

export interface QueryParamItem {
  key: string;
  value: string;
  enabled: boolean;
  description?: string;
}

export interface HeaderItem {
  key: string;
  value: string;
  enabled: boolean;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  status: number | null;
  statusText: string;
  latencyMs: number;
}

export default function ApiPlayground() {
  const { user } = useAuth();

  // Selected Endpoint
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>('get-assets-catalog');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Request Configuration State
  const [httpMethod, setHttpMethod] = useState<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  const [endpointPath, setEndpointPath] = useState<string>('/api/assets');
  const [baseUrlOption, setBaseUrlOption] = useState<'relative' | 'sovranly' | 'custom'>('relative');
  const [customBaseUrl, setCustomBaseUrl] = useState<string>('');

  // Authentication State
  const [authMode, setAuthMode] = useState<'sandbox' | 'custom' | 'unauthenticated'>('sandbox');
  const [customToken, setCustomToken] = useState<string>('');
  
  // Parameters & Headers
  const [queryParams, setQueryParams] = useState<QueryParamItem[]>([
    { key: 'scope', value: 'marketplace', enabled: true, description: 'Scope filter' }
  ]);
  const [headers, setHeaders] = useState<HeaderItem[]>([
    { key: 'Content-Type', value: 'application/json', enabled: true },
    { key: 'Accept', value: 'application/json', enabled: true }
  ]);

  // Request Body
  const [requestBody, setRequestBody] = useState<string>('');
  const [bodySyntaxError, setBodySyntaxError] = useState<string | null>(null);

  // Active Tabs
  const [requestTab, setRequestTab] = useState<'params' | 'headers' | 'body'>('params');
  const [responseTab, setResponseTab] = useState<'formatted' | 'raw' | 'headers'>('formatted');
  const [codeLang, setCodeLang] = useState<'curl' | 'ts' | 'python' | 'node'>('curl');

  // Execution & Telemetry
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseBody, setResponseBody] = useState<any>(null);
  const [rawResponseText, setRawResponseText] = useState<string>('');
  const [responseLatency, setResponseLatency] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<number | null>(null);
  const [responseSearchQuery, setResponseSearchQuery] = useState<string>('');

  // History & Copying
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const activeEndpoint = useMemo(() => {
    return SOVRANLY_ENDPOINTS.find(e => e.id === selectedEndpointId);
  }, [selectedEndpointId]);

  // Calculate active token
  const activeToken = useMemo(() => {
    if (authMode === 'unauthenticated') return null;
    if (authMode === 'sandbox') return 'sandbox-token-123';
    return customToken.trim() || null;
  }, [authMode, customToken]);

  // Synchronize when active endpoint changes
  const handleSelectEndpoint = (ep: EndpointDefinition) => {
    setSelectedEndpointId(ep.id);
    setHttpMethod(ep.method);
    setEndpointPath(ep.path);
    setQueryParams(ep.defaultQueryParams ? [...ep.defaultQueryParams] : []);
    
    // Auto-adjust auth mode based on requirement
    if (ep.requiresAuth && authMode === 'unauthenticated') {
      setAuthMode('sandbox');
    }

    if (ep.method === 'POST' && ep.defaultPayload) {
      setRequestBody(ep.defaultPayload);
      setBodySyntaxError(null);
      setRequestTab('body');
    } else {
      setRequestBody('');
      setBodySyntaxError(null);
      setRequestTab(ep.defaultQueryParams && ep.defaultQueryParams.length > 0 ? 'params' : 'headers');
    }
  };

  // Prettify JSON Body
  const handleFormatJson = () => {
    try {
      if (!requestBody.trim()) return;
      const parsed = JSON.parse(requestBody);
      setRequestBody(JSON.stringify(parsed, null, 2));
      setBodySyntaxError(null);
    } catch (e: any) {
      setBodySyntaxError(e.message || 'Malformed JSON');
    }
  };

  // Validate JSON Body on change
  const handleBodyChange = (value: string) => {
    setRequestBody(value);
    if (!value.trim()) {
      setBodySyntaxError(null);
      return;
    }
    try {
      JSON.parse(value);
      setBodySyntaxError(null);
    } catch (e: any) {
      setBodySyntaxError(e.message);
    }
  };

  // Construct Final URL
  const constructedUrl = useMemo(() => {
    const enabledParams = queryParams.filter(p => p.enabled && p.key.trim());
    let queryString = '';
    if (enabledParams.length > 0) {
      const search = new URLSearchParams();
      enabledParams.forEach(p => search.append(p.key.trim(), p.value));
      queryString = `?${search.toString()}`;
    }

    const pathWithQuery = `${endpointPath}${queryString}`;

    if (baseUrlOption === 'sovranly') {
      return `https://www.sovranlyip.com${pathWithQuery}`;
    }
    if (baseUrlOption === 'custom' && customBaseUrl.trim()) {
      const base = customBaseUrl.trim().replace(/\/+$/, '');
      return `${base}${pathWithQuery}`;
    }
    return pathWithQuery;
  }, [endpointPath, queryParams, baseUrlOption, customBaseUrl]);

  // Construct Headers for Execution
  const constructedHeaders = useMemo(() => {
    const headerMap: Record<string, string> = {};
    headers.filter(h => h.enabled && h.key.trim()).forEach(h => {
      headerMap[h.key.trim()] = h.value;
    });

    if (activeToken) {
      headerMap['Authorization'] = `Bearer ${activeToken}`;
    }

    return headerMap;
  }, [headers, activeToken]);

  // Real-time Code Snippet Generation
  const generatedCode = useMemo(() => {
    const headerEntries = Object.entries(constructedHeaders);
    
    // cURL
    let curl = `curl -X ${httpMethod} "${constructedUrl}"`;
    headerEntries.forEach(([k, v]) => {
      curl += ` \\\n  -H "${k}: ${v}"`;
    });
    if ((httpMethod === 'POST' || httpMethod === 'PUT') && requestBody.trim()) {
      curl += ` \\\n  -d '${requestBody.replace(/\n/g, ' ')}'`;
    }

    // TypeScript / Fetch
    const hasHeaders = headerEntries.length > 0;
    const hasBody = (httpMethod === 'POST' || httpMethod === 'PUT') && requestBody.trim();
    let ts = `const res = await fetch('${constructedUrl}', {\n  method: '${httpMethod}',`;
    if (hasHeaders) {
      ts += `\n  headers: {\n${headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n')}\n  },`;
    }
    if (hasBody) {
      ts += `\n  body: JSON.stringify(${requestBody.trim()}),`;
    }
    ts += `\n});\nconst data = await res.json();\nconsole.log(data);`;

    // Python
    let py = `import requests\n\nurl = "${constructedUrl}"\n`;
    if (hasHeaders) {
      py += `headers = {\n${headerEntries.map(([k, v]) => `    "${k}": "${v}"`).join(',\n')}\n}\n`;
    } else {
      py += `headers = {}\n`;
    }
    if (hasBody) {
      py += `payload = ${requestBody.trim()}\n`;
      py += `response = requests.${httpMethod.toLowerCase()}(url, headers=headers, json=payload)\n`;
    } else {
      py += `response = requests.${httpMethod.toLowerCase()}(url, headers=headers)\n`;
    }
    py += `print(response.status_code)\nprint(response.json())`;

    // Node.js (Axios)
    let node = `import axios from 'axios';\n\n`;
    node += `const config = {\n  method: '${httpMethod.toLowerCase()}',\n  url: '${constructedUrl}',\n`;
    if (hasHeaders) {
      node += `  headers: {\n${headerEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n')}\n  },\n`;
    }
    if (hasBody) {
      node += `  data: ${requestBody.trim()},\n`;
    }
    node += `};\n\nconst response = await axios(config);\nconsole.log(response.data);`;

    return { curl, ts, py, node };
  }, [httpMethod, constructedUrl, constructedHeaders, requestBody]);

  // Copy helper
  const copyToClipboard = (text: string, key: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  // Execution Engine
  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseStatusText('');
    setResponseBody(null);
    setRawResponseText('');
    setResponseHeaders({});
    setResponseLatency(null);
    setResponseSize(null);

    const startTime = performance.now();

    try {
      const fetchOptions: RequestInit = {
        method: httpMethod,
        headers: constructedHeaders
      };

      if ((httpMethod === 'POST' || httpMethod === 'PUT') && requestBody.trim()) {
        try {
          JSON.parse(requestBody);
          fetchOptions.body = requestBody;
        } catch (jsonErr: any) {
          setIsLoading(false);
          setResponseStatus(400);
          setResponseStatusText('Client JSON Parse Error');
          setBodySyntaxError(jsonErr.message);
          return;
        }
      }

      // Execute request
      const response = await fetch(constructedUrl, fetchOptions);
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      setResponseLatency(latency);
      setResponseStatus(response.status);
      setResponseStatusText(response.statusText || (response.ok ? 'OK' : 'Error'));

      // Extract response headers
      const headersObj: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        headersObj[key] = val;
      });
      setResponseHeaders(headersObj);

      // Read response body
      const rawText = await response.text();
      setRawResponseText(rawText);
      setResponseSize(new Blob([rawText]).size);

      try {
        const json = JSON.parse(rawText);
        setResponseBody(json);
      } catch {
        setResponseBody({ message: rawText });
      }

      // Push to History
      const newHistoryItem: HistoryItem = {
        id: `req_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        method: httpMethod,
        url: constructedUrl,
        status: response.status,
        statusText: response.statusText || 'OK',
        latencyMs: latency
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

    } catch (err: any) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      setResponseLatency(latency);
      setResponseStatus(0);
      setResponseStatusText('Network / CORS Error');
      setResponseBody({
        error: "Execution Failed",
        details: err.message || "Failed to fetch resource. If testing external domain, verify CORS permissions or switch base URL to relative.",
        timestamp: new Date().toISOString()
      });
      setRawResponseText(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  // Filter endpoints
  const filteredEndpoints = useMemo(() => {
    return SOVRANLY_ENDPOINTS.filter(ep => {
      const matchesCategory = activeCategory === 'All' || ep.category === activeCategory;
      const matchesSearch = 
        ep.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ep.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
        ep.method.toLowerCase().includes(searchFilter.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchFilter]);

  // Download JSON response
  const handleDownloadResponse = () => {
    if (!rawResponseText) return;
    const blob = new Blob([rawResponseText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sovranly-api-response-${selectedEndpointId}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Overview */}
      <div className="p-6 md:p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-teal-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive REST Playground</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Test Authenticated Sovranly IP Endpoints
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Execute live, real-time <code className="text-emerald-400 font-mono text-xs">GET</code> and <code className="text-cyan-400 font-mono text-xs">POST</code> requests against zero-trust blockchain notarization, 85/15 creator royalty accounting, instant sync clearances, and cryptographic verification routes.
            </p>
          </div>

          {/* Quick Authentication Status Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-3 h-3 rounded-full ${authMode === 'unauthenticated' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-400 shadow-lg shadow-emerald-500/50'}`} />
              <div>
                <p className="text-[11px] font-mono text-zinc-400 uppercase font-bold">Zero-Trust Perimeter</p>
                <p className="text-xs font-bold text-white">
                  {authMode === 'sandbox' ? 'Sovereign Sandbox Token Active' : 
                   authMode === 'custom' ? 'Custom Bearer Token' : 'Unauthenticated (Probe Mode)'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Controls Bar */}
        <div className="mt-6 pt-6 border-t border-zinc-900/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-cyan-400" /> Auth Mode:
            </span>
            
            <button
              onClick={() => setAuthMode('sandbox')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                authMode === 'sandbox' 
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm' 
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Sandbox Key (Default)
            </button>

            <button
              onClick={() => setAuthMode('custom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                authMode === 'custom' 
                  ? 'bg-cyan-950/80 border-cyan-500 text-cyan-300 shadow-sm' 
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              Custom Bearer
            </button>

            <button
              onClick={() => setAuthMode('unauthenticated')}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer border ${
                authMode === 'unauthenticated' 
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm' 
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-rose-400'
              }`}
              title="Test 401 Unauthorized responses"
            >
              Unauthenticated (Test 401)
            </button>
          </div>

          {/* Token Preview / Custom Input */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {authMode === 'custom' ? (
              <Input
                type="text"
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                placeholder="Enter custom JWT or API token..."
                className="bg-zinc-900 border-zinc-700 text-xs font-mono text-white h-8 w-64 rounded-xl"
              />
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500">Header:</span>
                <span className="text-cyan-400 font-bold truncate max-w-[200px]">
                  {activeToken ? `Bearer ${activeToken.substring(0, 16)}...` : 'None (401 Probe)'}
                </span>
                {activeToken && (
                  <button 
                    onClick={() => copyToClipboard(`Bearer ${activeToken}`, 'auth-header-copy')}
                    className="hover:text-white ml-1 text-zinc-400"
                    title="Copy Authorization Header"
                  >
                    {copiedKey === 'auth-header-copy' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Grid: Endpoint Selector & Request/Response Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Sidebar: Endpoints Catalog (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-4">
            
            {/* Search and Category Filter */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> API Endpoints
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                  {filteredEndpoints.length} Routes
                </span>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                <Input
                  type="text"
                  placeholder="Filter endpoints..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="bg-zinc-900/80 border-zinc-800 pl-9 text-xs font-mono text-white rounded-xl h-8 focus-visible:ring-cyan-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {['All', 'Assets', 'Royalties', 'Permissions', 'Verification', 'Developer'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-mono transition-all cursor-pointer ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-black font-bold'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Endpoints List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredEndpoints.map((ep) => {
                const isSelected = ep.id === selectedEndpointId;
                const isPost = ep.method === 'POST';
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left p-3 rounded-2xl transition-all border cursor-pointer group ${
                      isSelected
                        ? 'bg-zinc-900 border-cyan-500 shadow-md'
                        : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-900/80 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isPost 
                          ? 'bg-cyan-950 text-cyan-400 border border-cyan-800/40' 
                          : 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                      }`}>
                        {ep.method}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">
                        {ep.requiresAuth ? (
                          <span className="flex items-center gap-1 text-amber-400/80">
                            <Lock className="w-2.5 h-2.5" /> Auth
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400/80">
                            <Unlock className="w-2.5 h-2.5" /> Public
                          </span>
                        )}
                      </span>
                    </div>

                    <p className={`text-xs font-bold transition-colors ${isSelected ? 'text-white' : 'text-zinc-300 group-hover:text-white'}`}>
                      {ep.title}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-500 truncate mt-0.5">
                      {ep.path}
                    </p>
                  </button>
                );
              })}

              {filteredEndpoints.length === 0 && (
                <div className="p-6 text-center text-zinc-500 text-xs font-mono">
                  No matching endpoints found.
                </div>
              )}
            </div>

            {/* Custom Endpoint Option */}
            <div className="pt-2 border-t border-zinc-900">
              <button
                onClick={() => {
                  setSelectedEndpointId('custom-manual');
                  setEndpointPath('/api/');
                  setQueryParams([]);
                }}
                className={`w-full p-2.5 rounded-xl border text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  selectedEndpointId === 'custom-manual'
                    ? 'bg-zinc-900 border-cyan-500 text-white'
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                Custom Endpoint Builder
              </button>
            </div>
          </div>

          {/* Execution History */}
          {history.length > 0 && (
            <div className="p-4 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Recent Runs
                </h4>
                <button
                  onClick={() => setHistory([])}
                  className="text-[10px] font-mono text-zinc-500 hover:text-rose-400 transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto">
                {history.map((h) => (
                  <div 
                    key={h.id}
                    className="p-2 rounded-xl bg-zinc-900/50 border border-zinc-850 flex items-center justify-between text-[11px] font-mono"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-1 rounded text-[9px] font-bold ${
                        h.method === 'POST' ? 'text-cyan-400' : 'text-emerald-400'
                      }`}>
                        {h.method}
                      </span>
                      <span className="text-zinc-300 truncate max-w-[120px]">{h.url}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={h.status && h.status < 300 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {h.status || 'ERR'}
                      </span>
                      <span className="text-zinc-500 text-[10px]">{h.latencyMs}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Panel: Request Builder & Live Response (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Request Header / Method / URL Bar */}
          <div className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-5">
            
            {/* Active Endpoint Info Header */}
            {activeEndpoint && (
              <div className="space-y-1 pb-4 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {activeEndpoint.title}
                  </h3>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {activeEndpoint.category}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {activeEndpoint.description}
                </p>
              </div>
            )}

            {/* URL Input & Method Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              
              {/* Method Switcher */}
              <select
                value={httpMethod}
                onChange={(e) => setHttpMethod(e.target.value as any)}
                aria-label="HTTP Method"
                className={`px-3 py-2.5 rounded-xl text-xs font-mono font-bold cursor-pointer border transition-all ${
                  httpMethod === 'POST' 
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-700' 
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                }`}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>

              {/* Base URL Switcher */}
              <select
                value={baseUrlOption}
                onChange={(e) => setBaseUrlOption(e.target.value as any)}
                aria-label="Target Host Domain"
                className="bg-zinc-900 border-zinc-800 text-zinc-300 text-xs font-mono px-3 py-2.5 rounded-xl border cursor-pointer hover:border-zinc-700"
              >
                <option value="relative">Current Origin (Sandbox)</option>
                <option value="sovranly">https://www.sovranlyip.com</option>
                <option value="custom">Custom Host URL...</option>
              </select>

              {/* Custom Base URL input if selected */}
              {baseUrlOption === 'custom' && (
                <div className="relative w-48">
                  <Input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://your-api.com"
                    className="bg-zinc-900/90 border-zinc-800 font-mono text-xs text-cyan-300 rounded-xl py-2.5 focus-visible:ring-cyan-500"
                  />
                </div>
              )}

              {/* Endpoint Path Input */}
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={endpointPath}
                  onChange={(e) => setEndpointPath(e.target.value)}
                  placeholder="/api/..."
                  className="bg-zinc-900/90 border-zinc-800 font-mono text-xs text-white rounded-xl py-2.5 focus-visible:ring-cyan-500"
                />
              </div>

              {/* Execute Button */}
              <Button
                onClick={handleExecuteRequest}
                disabled={isLoading}
                className="bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-black font-black font-mono text-xs px-6 py-2.5 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-950/60 shrink-0"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                ) : (
                  <Play className="w-4 h-4 fill-black" />
                )}
                <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
              </Button>
            </div>

            {/* Request Configuration Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRequestTab('params')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      requestTab === 'params'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Query Params ({queryParams.filter(q => q.enabled).length})
                  </button>

                  <button
                    onClick={() => setRequestTab('headers')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                      requestTab === 'headers'
                        ? 'bg-zinc-800 text-white'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    Headers ({headers.filter(h => h.enabled).length + (activeToken ? 1 : 0)})
                  </button>

                  {(httpMethod === 'POST' || httpMethod === 'PUT') && (
                    <button
                      onClick={() => setRequestTab('body')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        requestTab === 'body'
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span>JSON Body</span>
                      {bodySyntaxError && (
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      )}
                    </button>
                  )}
                </div>

                <span className="text-[11px] font-mono text-zinc-500 hidden sm:block">
                  Live URL: <code className="text-zinc-300">{constructedUrl}</code>
                </span>
              </div>

              {/* Tab 1: Query Params */}
              {requestTab === 'params' && (
                <div className="space-y-2">
                  <div className="space-y-2">
                    {queryParams.map((param, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={param.enabled}
                          onChange={(e) => {
                            const updated = [...queryParams];
                            updated[idx].enabled = e.target.checked;
                            setQueryParams(updated);
                          }}
                          className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={param.key}
                          onChange={(e) => {
                            const updated = [...queryParams];
                            updated[idx].key = e.target.value;
                            setQueryParams(updated);
                          }}
                          placeholder="key"
                          className="bg-zinc-900 border-zinc-800 font-mono text-xs text-white h-8 rounded-lg w-1/3"
                        />
                        <Input
                          type="text"
                          value={param.value}
                          onChange={(e) => {
                            const updated = [...queryParams];
                            updated[idx].value = e.target.value;
                            setQueryParams(updated);
                          }}
                          placeholder="value"
                          className="bg-zinc-900 border-zinc-800 font-mono text-xs text-white h-8 rounded-lg flex-1"
                        />
                        <button
                          onClick={() => {
                            setQueryParams(queryParams.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setQueryParams([...queryParams, { key: '', value: '', enabled: true }]);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer pt-1"
                  >
                    + Add Query Parameter
                  </button>
                </div>
              )}

              {/* Tab 2: Headers */}
              {requestTab === 'headers' && (
                <div className="space-y-3">
                  <div className="space-y-2">
                    {/* Simulated Auth Header */}
                    <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-900/60 border border-zinc-850 text-xs font-mono">
                      <span className="text-zinc-500 w-28 shrink-0">Authorization:</span>
                      <span className="text-cyan-400 font-bold truncate flex-1">
                        {activeToken ? `Bearer ${activeToken}` : '(No token attached - testing 401 response)'}
                      </span>
                      <span className="text-[10px] text-zinc-500">Configured in Auth Bar</span>
                    </div>

                    {headers.map((h, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={h.enabled}
                          onChange={(e) => {
                            const updated = [...headers];
                            updated[idx].enabled = e.target.checked;
                            setHeaders(updated);
                          }}
                          className="rounded border-zinc-700 bg-zinc-900 text-cyan-500 cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={h.key}
                          onChange={(e) => {
                            const updated = [...headers];
                            updated[idx].key = e.target.value;
                            setHeaders(updated);
                          }}
                          placeholder="Header-Name"
                          className="bg-zinc-900 border-zinc-800 font-mono text-xs text-white h-8 rounded-lg w-1/3"
                        />
                        <Input
                          type="text"
                          value={h.value}
                          onChange={(e) => {
                            const updated = [...headers];
                            updated[idx].value = e.target.value;
                            setHeaders(updated);
                          }}
                          placeholder="Value"
                          className="bg-zinc-900 border-zinc-800 font-mono text-xs text-white h-8 rounded-lg flex-1"
                        />
                        <button
                          onClick={() => {
                            setHeaders(headers.filter((_, i) => i !== idx));
                          }}
                          className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setHeaders([...headers, { key: '', value: '', enabled: true }]);
                    }}
                    className="text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer pt-1"
                  >
                    + Add Custom Header
                  </button>
                </div>
              )}

              {/* Tab 3: Request Body (JSON) */}
              {(httpMethod === 'POST' || httpMethod === 'PUT') && requestTab === 'body' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 uppercase text-[10px]">JSON Payload</span>
                      {bodySyntaxError ? (
                        <span className="text-rose-400 text-[11px] flex items-center gap-1 font-bold">
                          <AlertCircle className="w-3 h-3" /> Syntax Error
                        </span>
                      ) : (
                        <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-bold">
                          <Check className="w-3 h-3" /> Valid JSON
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleFormatJson}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer text-[11px]"
                      >
                        Format / Prettify
                      </button>
                      {activeEndpoint?.defaultPayload && (
                        <button
                          onClick={() => {
                            setRequestBody(activeEndpoint.defaultPayload || '');
                            setBodySyntaxError(null);
                          }}
                          className="text-zinc-400 hover:text-white transition-colors cursor-pointer text-[11px]"
                        >
                          Reset Template
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="relative">
                    <textarea
                      value={requestBody}
                      onChange={(e) => handleBodyChange(e.target.value)}
                      placeholder={'{\n  "key": "value"\n}'}
                      rows={9}
                      className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-emerald-300 focus:outline-none focus:border-cyan-500 transition-colors resize-y leading-relaxed"
                    />
                  </div>

                  {bodySyntaxError && (
                    <p className="text-[11px] font-mono text-rose-400 bg-rose-950/40 p-2 rounded-lg border border-rose-900/50">
                      {bodySyntaxError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Real-time Response Viewer Panel */}
          <div className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-4">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" /> Response Output
                </h3>

                {responseStatus !== null && (
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                      responseStatus >= 200 && responseStatus < 300 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60' 
                        : responseStatus >= 400 && responseStatus < 500
                        ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                        : 'bg-rose-950 text-rose-300 border border-rose-700/60'
                    }`}>
                      {responseStatus} {responseStatusText}
                    </span>

                    {responseLatency !== null && (
                      <span className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-yellow-400" /> {responseLatency}ms
                      </span>
                    )}

                    {responseSize !== null && (
                      <span className="text-[11px] font-mono text-zinc-500">
                        ({(responseSize / 1024).toFixed(2)} KB)
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* View Modes & Action Tools */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                  <button
                    onClick={() => setResponseTab('formatted')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      responseTab === 'formatted' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    JSON
                  </button>
                  <button
                    onClick={() => setResponseTab('raw')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      responseTab === 'raw' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Raw
                  </button>
                  <button
                    onClick={() => setResponseTab('headers')}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      responseTab === 'headers' ? 'bg-cyan-500 text-black font-bold shadow-sm' : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    Headers
                  </button>
                </div>

                {rawResponseText && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => copyToClipboard(rawResponseText, 'response-json-copy')}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                      title="Copy Response JSON"
                    >
                      {copiedKey === 'response-json-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handleDownloadResponse}
                      className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                      title="Download Response .json"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Response Display Box */}
            {isLoading ? (
              <div className="py-20 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
                <p className="text-xs font-mono text-zinc-400">Executing live request to {constructedUrl}...</p>
              </div>
            ) : responseStatus === null ? (
              <div className="py-16 text-center space-y-3 rounded-2xl bg-zinc-950 border border-dashed border-zinc-800/80">
                <Terminal className="w-8 h-8 text-zinc-600 mx-auto" />
                <p className="text-xs font-mono text-zinc-400">
                  Ready to test. Click <span className="text-cyan-400 font-bold">&ldquo;Send Request&rdquo;</span> above to execute this endpoint.
                </p>
                <p className="text-[11px] font-mono text-zinc-600">
                  Tip: Use the Auth Mode bar above to test both authenticated 200 OK and zero-trust 401 Unauthorized responses.
                </p>
              </div>
            ) : responseTab === 'headers' ? (
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500">
                      <th className="pb-2 font-bold uppercase text-[10px]">Header</th>
                      <th className="pb-2 font-bold uppercase text-[10px]">Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {Object.entries(responseHeaders).map(([k, v]) => (
                      <tr key={k} className="hover:bg-zinc-900/30">
                        <td className="py-2 text-cyan-400 font-semibold pr-4">{k}</td>
                        <td className="py-2 text-zinc-300 break-all">{v}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Search Filter for Response */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
                  <Input
                    type="text"
                    placeholder="Search response keys & values..."
                    value={responseSearchQuery}
                    onChange={(e) => setResponseSearchQuery(e.target.value)}
                    className="bg-zinc-950 border-zinc-850 pl-9 text-xs font-mono text-zinc-300 h-8 rounded-xl"
                  />
                </div>

                {/* Formatted or Raw JSON Container */}
                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 font-mono text-xs text-zinc-200 overflow-x-auto max-h-[480px] shadow-inner leading-relaxed">
                  {responseTab === 'raw' ? (
                    <pre className="whitespace-pre-wrap">{rawResponseText}</pre>
                  ) : (
                    <JsonResponseRenderer data={responseBody} filterText={responseSearchQuery} />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Real-time Code Snippets Generator */}
          <div className="p-6 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-cyan-400" /> Real-time Code Snippet
                </h4>
                <p className="text-[11px] text-zinc-500 font-mono">
                  Synchronizes automatically with active method, auth token, and JSON payload.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs font-mono">
                  {(['curl', 'ts', 'python', 'node'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer uppercase text-[10px] font-bold ${
                        codeLang === lang ? 'bg-cyan-500 text-black shadow-sm' : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {lang === 'ts' ? 'TypeScript' : lang === 'node' ? 'Node Axios' : lang}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const code = codeLang === 'curl' ? generatedCode.curl 
                      : codeLang === 'ts' ? generatedCode.ts 
                      : codeLang === 'python' ? generatedCode.py 
                      : generatedCode.node;
                    copyToClipboard(code, 'snippet-copy');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedKey === 'snippet-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'snippet-copy' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-850 font-mono text-xs text-zinc-300 overflow-x-auto shadow-inner">
              <pre className="whitespace-pre">
                {codeLang === 'curl' && generatedCode.curl}
                {codeLang === 'ts' && generatedCode.ts}
                {codeLang === 'python' && generatedCode.py}
                {codeLang === 'node' && generatedCode.node}
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

/**
 * Syntax-highlighted real-time JSON formatter with search and type-coloring
 */
function JsonResponseRenderer({ data, filterText }: { data: any; filterText: string }) {
  if (data === null) return <span className="text-zinc-500 font-bold">null</span>;
  if (data === undefined) return <span className="text-zinc-500 font-bold">undefined</span>;

  const jsonString = JSON.stringify(data, null, 2);

  if (!filterText.trim()) {
    // Render syntax-highlighted HTML safely
    return <FormattedJsonBlock data={data} indent={0} />;
  }

  // If search filter active, highlight matching lines
  const lines = jsonString.split('\n');
  return (
    <div className="space-y-0.5">
      {lines.map((line, idx) => {
        const isMatch = line.toLowerCase().includes(filterText.toLowerCase());
        return (
          <div 
            key={idx} 
            className={`font-mono leading-relaxed px-1 rounded ${isMatch ? 'bg-cyan-950/80 text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-zinc-400'}`}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
}

/**
 * Recursive JSON renderer with syntax colorings
 */
function FormattedJsonBlock({ data, indent = 0 }: { data: any; indent: number }) {
  const [collapsed, setCollapsed] = useState(false);
  const indentSpace = '  '.repeat(indent);

  if (typeof data === 'string') {
    return <span className="text-emerald-300">&quot;{data}&quot;</span>;
  }
  if (typeof data === 'number') {
    return <span className="text-amber-300 font-bold">{data}</span>;
  }
  if (typeof data === 'boolean') {
    return <span className="text-violet-400 font-bold">{data ? 'true' : 'false'}</span>;
  }
  if (data === null) {
    return <span className="text-zinc-500 font-bold">null</span>;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return <span>[]</span>;
    return (
      <span>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-zinc-500 hover:text-white cursor-pointer inline-flex items-center text-[10px] mr-1"
        >
          {collapsed ? `▶ [${data.length} items]` : '['}
        </button>
        {!collapsed && (
          <div className="pl-4 border-l border-zinc-800/80 my-0.5">
            {data.map((item, idx) => (
              <div key={idx} className="leading-relaxed">
                <FormattedJsonBlock data={item} indent={indent + 1} />
                {idx < data.length - 1 && <span className="text-zinc-500">,</span>}
              </div>
            ))}
          </div>
        )}
        {!collapsed && <span>]</span>}
      </span>
    );
  }

  if (typeof data === 'object') {
    const keys = Object.keys(data);
    if (keys.length === 0) return <span>{'{}'}</span>;
    return (
      <span>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-zinc-500 hover:text-white cursor-pointer inline-flex items-center text-[10px] mr-1"
        >
          {collapsed ? `▶ {${keys.length} keys}` : '{'}
        </button>
        {!collapsed && (
          <div className="pl-4 border-l border-zinc-800/80 my-0.5">
            {keys.map((key, idx) => (
              <div key={key} className="leading-relaxed">
                <span className="text-cyan-400 font-semibold">&quot;{key}&quot;</span>
                <span className="text-zinc-500 mr-1.5">:</span>
                <FormattedJsonBlock data={data[key]} indent={indent + 1} />
                {idx < keys.length - 1 && <span className="text-zinc-500">,</span>}
              </div>
            ))}
          </div>
        )}
        {!collapsed && <span>{'}'}</span>}
      </span>
    );
  }

  return <span>{String(data)}</span>;
}
