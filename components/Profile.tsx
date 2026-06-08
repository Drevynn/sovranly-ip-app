'use client';
import { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({ name: 'Jane Creator', bio: 'Digital Artist & Musician' });
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-8 max-w-lg">
      <h2 className="text-xl font-semibold mb-6 text-white">User Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs uppercase text-zinc-500 font-bold block mb-1">Name</label>
          <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-zinc-950 p-3 rounded-lg border border-white/10 text-white" />
        </div>
        <div>
          <label className="text-xs uppercase text-zinc-500 font-bold block mb-1">Bio</label>
          <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} className="w-full bg-zinc-950 p-3 rounded-lg border border-white/10 text-white" rows={4} />
        </div>
        <button className="bg-white text-black px-4 py-2 rounded font-bold text-sm hover:bg-zinc-200">Save Profile</button>
      </div>
    </div>
  );
}
