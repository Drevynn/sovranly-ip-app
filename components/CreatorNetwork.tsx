'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { getDb } from '@/lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Users, 
  Send, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  Briefcase,
  Globe2,
  RefreshCw,
  Search,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NetworkPost {
  id: string;
  content: string;
  authorName: string;
  authorAddress: string;
  postType: 'general' | 'collab' | 'license' | 'announcement';
  likes: number;
  createdAt: string;
}

export default function CreatorNetwork() {
  const { user, isSandboxMode } = useAuth();
  const [posts, setPosts] = useState<NetworkPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [postType, setPostType] = useState<'general' | 'collab' | 'license' | 'announcement'>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const feedEndRef = useRef<HTMLDivElement>(null);

  // Real-time listener for posts
  useEffect(() => {
    let unsubscribe: () => void;
    try {
      const db = getDb();
      const q = query(
        collection(db, 'network_posts'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedPosts: NetworkPost[] = [];
        snapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() } as NetworkPost);
        });
        setPosts(fetchedPosts);
        setIsLoading(false);
      });
    } catch (error) {
      console.error('Error setting up real-time listener:', error);
      
      setIsLoading(false);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const headers = await getAuthHeaders(user, isSandboxMode);
      const res = await fetch('/api/network_posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          content: newPostContent,
          authorName: user.displayName || 'Anonymous Creator',
          authorAddress: user.uid,
          postType
        })
      });

      if (res.ok) {
        setNewPostContent('');
        setPostType('general');
        // Let the real-time listener pick up the change!
      }
    } catch (error) {
      console.error('Failed to publish post', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPostTypeIcon = (type: string) => {
    switch(type) {
      case 'collab': return <Users className="w-3.5 h-3.5 text-indigo-400" />;
      case 'license': return <Briefcase className="w-3.5 h-3.5 text-amber-400" />;
      case 'announcement': return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      default: return <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 font-sans text-left h-full flex flex-col">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-900 pb-4 gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-indigo-400 animate-pulse" />
            Sovereign Creator Network
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">
            Real-time IP collaboration, licensing requests, and community pulse.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-900">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Sync Active
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start flex-1 min-h-0">
        
        {/* Left Column: Post Composer */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-zinc-950 border border-zinc-900 shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-zinc-900/40 border-b border-zinc-900 py-4 px-5">
              <h3 className="text-xs font-mono uppercase font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" /> Transmit Update
              </h3>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <form onSubmit={handlePost} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Channel Classification</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPostType('general')} className={`py-2 px-2 text-[10px] font-mono font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 uppercase ${postType === 'general' ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-400' : 'bg-zinc-900 border-zinc-850 text-zinc-500'}`}>
                      General
                    </button>
                    <button type="button" onClick={() => setPostType('collab')} className={`py-2 px-2 text-[10px] font-mono font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 uppercase ${postType === 'collab' ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-400' : 'bg-zinc-900 border-zinc-850 text-zinc-500'}`}>
                      Collab
                    </button>
                    <button type="button" onClick={() => setPostType('license')} className={`py-2 px-2 text-[10px] font-mono font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 uppercase ${postType === 'license' ? 'bg-amber-950/40 border-amber-500/50 text-amber-400' : 'bg-zinc-900 border-zinc-850 text-zinc-500'}`}>
                      License Req
                    </button>
                    <button type="button" onClick={() => setPostType('announcement')} className={`py-2 px-2 text-[10px] font-mono font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 uppercase ${postType === 'announcement' ? 'bg-rose-950/40 border-rose-500/50 text-rose-400' : 'bg-zinc-900 border-zinc-850 text-zinc-500'}`}>
                      Drop
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-zinc-500 font-bold block">Payload Context</label>
                  <Textarea 
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share an update, look for collaborators, or announce an IP drop..."
                    className="min-h-[120px] bg-zinc-900/50 border-zinc-800 rounded-xl text-sm text-zinc-300 focus-visible:ring-cyan-500 resize-none font-sans"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newPostContent.trim()}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-5 text-xs font-bold uppercase tracking-wider font-mono shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <span className="flex items-center gap-2">Broadcast to Network <Send className="w-3.5 h-3.5" /></span>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Real-time Feed */}
        <div className="lg:col-span-8 flex flex-col h-[700px]">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl flex-1 overflow-hidden flex flex-col">
            <div className="border-b border-zinc-900 pb-4 mb-4 flex justify-between items-center shrink-0">
              <h3 className="text-xs font-mono uppercase font-black text-white flex items-center gap-2">
                <Hash className="w-4 h-4 text-zinc-500" /> Live Comm-Stream
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full space-y-3 opacity-50">
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                  <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500">Connecting to stream...</span>
                </div>
              ) : posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                  <MessageSquare className="w-8 h-8 text-zinc-700" />
                  <p className="text-xs font-bold text-zinc-500">The network is quiet.</p>
                  <p className="text-[10px] font-mono text-zinc-600">Be the first to broadcast a payload.</p>
                </div>
              ) : (
                <AnimatePresence>
                  {posts.map((post) => (
                    <motion.div 
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-[#09090b] border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-400">
                            {post.authorName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
                              {post.authorName} <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            </p>
                            <p className="text-[9px] font-mono text-zinc-500 uppercase flex items-center gap-1">
                              {post.authorAddress ? `${post.authorAddress.slice(0,6)}...${post.authorAddress.slice(-4)}` : 'Verified Node'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-md flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-zinc-400">
                            {getPostTypeIcon(post.postType)} {post.postType}
                          </span>
                          <span className="text-[9px] font-mono text-zinc-600">
                            {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap ml-10">
                        {post.content}
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
              <div ref={feedEndRef} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
