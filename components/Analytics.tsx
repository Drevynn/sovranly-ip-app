'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const data = [
    { name: 'Jun', Projected: 12, Conservative: 9 },
    { name: 'Jul', Projected: 18, Conservative: 14 },
    { name: 'Aug', Projected: 25, Conservative: 19 },
    { name: 'Sep', Projected: 31, Conservative: 24 },
    { name: 'Oct', Projected: 38, Conservative: 29 },
    { name: 'Nov', Projected: 44, Conservative: 33 },
    { name: 'Dec', Projected: 52, Conservative: 38 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
         <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl"><p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">24h Volume</p><p className="text-4xl font-light tracking-tighter">$14.8M</p></div>
         <div className="bg-zinc-900/50 border border-white/5 p-5 rounded-2xl"><p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-bold mb-2">Predicted Q3</p><p className="text-4xl font-light tracking-tighter text-violet-400">$48.7M</p></div>
      </div>
      <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 rounded-2xl p-6">
        <h2 className="font-semibold mb-6">Revenue Forecast (90 Days)</h2>
        <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" stroke="#333" />
               <XAxis dataKey="name" stroke="#666" />
               <YAxis stroke="#666" />
               <Tooltip contentStyle={{backgroundColor: '#18181b', border: 'none'}} />
               <Line type="monotone" dataKey="Projected" stroke="#a855f7" strokeWidth={2} />
               <Line type="monotone" dataKey="Conservative" stroke="#67e8f9" strokeWidth={2} strokeDasharray="5 5" />
             </LineChart>
           </ResponsiveContainer>
         </div>
      </div>
    </div>
  );
}
