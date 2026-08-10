'use client';

import { useState, useEffect, useRef } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Activity, Server, Cpu, Database, CheckCircle, RefreshCw, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LatencyDataPoint {
  time: string;
  latency: number;
}

type NodeKey = 'ipfs' | 'oracle' | 'vector' | 'auth';

interface NodeConfig {
  name: string;
  icon: React.ReactNode;
  avgLatency: number;
  variance: number;
  color: string;
}

const nodes: Record<NodeKey, NodeConfig> = {
  ipfs: {
    name: 'IPFS Pinning Gateway',
    icon: <Database className="w-4 h-4 text-cyan-400" />,
    avgLatency: 145,
    variance: 25,
    color: '#06b6d4', // cyan-500
  },
  oracle: {
    name: 'Smart Contract Oracle',
    icon: <Cpu className="w-4 h-4 text-violet-400" />,
    avgLatency: 320,
    variance: 60,
    color: '#8b5cf6', // violet-500
  },
  vector: {
    name: 'AI Vector Indexer',
    icon: <Zap className="w-4 h-4 text-amber-400" />,
    avgLatency: 210,
    variance: 35,
    color: '#f59e0b', // amber-500
  },
  auth: {
    name: 'Auth Verification Node',
    icon: <Server className="w-4 h-4 text-emerald-400" />,
    avgLatency: 45,
    variance: 10,
    color: '#10b981', // emerald-500
  },
};

export default function ApiLatencyMonitor() {
  const [activeNode, setActiveNode] = useState<NodeKey>('ipfs');
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  // Store series data in refs to avoid useEffect dependency triggers but use state for re-rendering
  const [chartData, setChartData] = useState<LatencyDataPoint[]>([]);

  // Helper to generate initial dataset
  const generateInitialData = (node: NodeKey): LatencyDataPoint[] => {
    const data: LatencyDataPoint[] = [];
    const base = nodes[node].avgLatency;
    const dev = nodes[node].variance;
    const now = Date.now();
    
    for (let i = 9; i >= 0; i--) {
      const timeStr = new Date(now - i * 5000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      // Generate realistic latency (always positive)
      const latencyVal = Math.max(10, Math.floor(base + (Math.random() - 0.5) * dev * 2));
      data.push({ time: timeStr, latency: latencyVal });
    }
    return data;
  };

  // Set initial data on mount and node switch
  useEffect(() => {
    /* eslint-disable-next-line react-hooks/set-state-in-effect */
    setChartData(generateInitialData(activeNode));
    setLastUpdated(new Date().toLocaleTimeString());
  }, [activeNode]);

  // Live ticking mechanism
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setChartData(prev => {
        const base = nodes[activeNode].avgLatency;
        const dev = nodes[activeNode].variance;
        const nextTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const nextLatency = Math.max(10, Math.floor(base + (Math.random() - 0.5) * dev * 2));
        
        // Append new data point and maintain a window of 10 points
        const updated = [...prev.slice(1), { time: nextTime, latency: nextLatency }];
        return updated;
      });
      setLastUpdated(new Date().toLocaleTimeString());
    }, 4000);

    return () => clearInterval(interval);
  }, [activeNode, isLive]);

  // Calculate current statistical outputs
  const currentAvg = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.latency, 0) / chartData.length)
    : nodes[activeNode].avgLatency;

  const currentMax = chartData.length > 0
    ? Math.max(...chartData.map(d => d.latency))
    : nodes[activeNode].avgLatency + nodes[activeNode].variance;

  const currentMin = chartData.length > 0
    ? Math.min(...chartData.map(d => d.latency))
    : Math.max(5, nodes[activeNode].avgLatency - nodes[activeNode].variance);

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden shadow-xl" id="api-latency-monitor">
      {/* Background radial highlight */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl pointer-events-none transition-all duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at top right, ${nodes[activeNode].color}10, transparent 70%)`
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-mono tracking-widest font-black flex items-center gap-1.5" style={{ color: nodes[activeNode].color }}>
            <Activity className="w-3.5 h-3.5" /> Performance & Health Ledger
          </span>
          <h2 className="text-xl font-black text-white uppercase tracking-tight">API Latency Monitor</h2>
          <p className="text-xs text-zinc-500">Real-time gateway telemetry and response metrics for decentralized service nodes.</p>
        </div>

        {/* Live Controller Buttons */}
        <div className="flex items-center gap-2">
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-850">
            <button
              onClick={() => setIsLive(true)}
              className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                isLive 
                  ? 'bg-zinc-950 border border-zinc-800 text-emerald-400 shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-emerald-500 ${isLive ? 'animate-pulse' : ''}`} />
              Live Feed
            </button>
            <button
              onClick={() => setIsLive(false)}
              className={`px-3 py-1.5 text-[9px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer ${
                !isLive 
                  ? 'bg-zinc-950 border border-zinc-800 text-zinc-300 shadow' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Paused
            </button>
          </div>
          <button
            onClick={() => setChartData(generateInitialData(activeNode))}
            className="p-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
            title="Refresh Ledger"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid of Nodes Selectors & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Select Nodes */}
        <div className="lg:col-span-4 flex flex-col gap-2.5">
          <span className="text-[8px] font-mono uppercase text-zinc-500 font-bold tracking-wider">Select System Gateway</span>
          
          {(Object.keys(nodes) as NodeKey[]).map((key) => {
            const config = nodes[key];
            const isSelected = activeNode === key;
            return (
              <button
                key={key}
                onClick={() => setActiveNode(key)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected 
                    ? 'bg-zinc-900/40 text-white' 
                    : 'bg-[#060608] border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
                }`}
                style={{
                  borderColor: isSelected ? `${config.color}30` : undefined,
                  boxShadow: isSelected ? `${config.color}05 0px 10px 15px -3px` : undefined
                }}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div 
                    className="p-2 rounded-xl flex items-center justify-center border"
                    style={{ 
                      backgroundColor: isSelected ? `${config.color}15` : '#09090b',
                      borderColor: isSelected ? `${config.color}35` : '#18181b'
                    }}
                  >
                    {config.icon}
                  </div>
                  <div className="truncate">
                    <span className="text-[11px] font-bold block truncate font-sans">{config.name}</span>
                    <span className="text-[9px] font-mono text-zinc-500">Target Response: ~{config.avgLatency}ms</span>
                  </div>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: config.color }} />
                )}
              </button>
            );
          })}

          {/* Inline Health Indicators */}
          <div className="mt-auto p-4 bg-[#050507] border border-zinc-900 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Gateway Health</span>
              <span className="text-[9px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> OPERATIONAL
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Node Uptime</span>
              <span className="text-[9px] font-mono text-white font-bold">99.98%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono text-zinc-500 uppercase">Last Sync</span>
              <span className="text-[9px] font-mono text-zinc-400 font-bold">{lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Visualizing Chart and Stats */}
        <div className="lg:col-span-8 bg-[#040406] border border-zinc-900 rounded-3xl p-5 flex flex-col justify-between space-y-6">
          
          {/* Key Metric Stats Bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-900/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
              <span className="block text-[8px] font-mono uppercase text-zinc-500">rolling average</span>
              <span className="block text-2xl font-black text-white font-mono" style={{ color: nodes[activeNode].color }}>
                {currentAvg}<span className="text-[10px] font-sans font-bold text-zinc-500 ml-0.5">ms</span>
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
              <span className="block text-[8px] font-mono uppercase text-zinc-500">peak response</span>
              <span className="block text-2xl font-black text-white font-mono">
                {currentMax}<span className="text-[10px] font-sans font-bold text-zinc-500 ml-0.5">ms</span>
              </span>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-900 p-3.5 rounded-2xl space-y-1">
              <span className="block text-[8px] font-mono uppercase text-zinc-500">minimum floor</span>
              <span className="block text-2xl font-black text-white font-mono">
                {currentMin}<span className="text-[10px] font-sans font-bold text-zinc-500 ml-0.5">ms</span>
              </span>
            </div>
          </div>

          {/* Recharts Line Chart Container */}
          <div className="h-56 relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#16161a" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#3f3f46" 
                  fontSize={8} 
                  fontFamily="monospace"
                  tickLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke="#3f3f46" 
                  fontSize={8} 
                  fontFamily="monospace"
                  tickLine={false}
                  dx={-5}
                  unit="ms"
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#09090b', 
                    border: '1px solid #27272a',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontFamily: 'sans-serif'
                  }} 
                  labelStyle={{ color: '#a1a1aa', fontWeight: 'bold' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="latency" 
                  stroke={nodes[activeNode].color} 
                  strokeWidth={2.5} 
                  dot={{ r: 3, strokeWidth: 1, stroke: '#09090b', fill: nodes[activeNode].color }}
                  activeDot={{ r: 5, strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Chart footer detail */}
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-500 border-t border-zinc-900 pt-3">
            <span>NETWORK ROUTING: DIRECT EDGE PIPELINE</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> SECURED SEC/TLS 1.3
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
