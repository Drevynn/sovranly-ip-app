'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function GuardianDashboard() {
  return (
    <div className="p-8 mx-auto max-w-4xl backdrop-blur-3xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-6">Guardian Control Center</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-950/40 border border-zinc-800 text-white">
          <CardHeader><CardTitle>System Health</CardTitle></CardHeader>
          <CardContent>
            <p className="text-emerald-400 font-mono">STATUS: OPERATIONAL</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-950/40 border border-zinc-800 text-white">
          <CardHeader><CardTitle>Emergency Actions</CardTitle></CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">Emergency Pause</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
