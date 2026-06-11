'use client';
import { useState } from 'react';
import { useAuth } from './auth/FirebaseProvider';

export default function Profile() {
  const { user } = useAuth();
  const [customName, setCustomName] = useState<string | null>(null);
  const [bio, setBio] = useState('Digital Artist & Musician');

  const resolvedName = customName !== null ? customName : (user?.displayName || user?.email || 'Jane Creator');

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 max-w-lg font-sans">
      <h2 className="text-xl font-semibold mb-6 text-white uppercase tracking-wider text-sm">User Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase text-zinc-500 font-bold block mb-1">Name</label>
          <input 
            type="text" 
            value={resolvedName} 
            onChange={(e) => setCustomName(e.target.value)} 
            className="w-full bg-zinc-950 p-3 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors" 
          />
        </div>
        <div>
          <label className="text-xs uppercase text-zinc-500 font-bold block mb-1">Bio</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="w-full bg-zinc-950 p-3 rounded-lg border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-colors" 
            rows={4} 
          />
        </div>
        <button className="bg-white text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all">
          Save Profile
        </button>
      </div>
    </div>
  );
}
