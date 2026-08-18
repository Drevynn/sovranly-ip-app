'use client';
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect } from 'react';
import { useAuth } from './auth/FirebaseProvider';
import { 
  Globe, 
  Twitter, 
  Instagram, 
  Github, 
  Youtube,
  Plus, 
  Trash2, 
  Check, 
  ExternalLink, 
  Camera, 
  Sparkles, 
  User, 
  BadgeCheck, 
  Eye, 
  Sliders, 
  PlusCircle, 
  Music, 
  Code, 
  Layers, 
  BookOpen, 
  Image as ImageIcon,
  Heart,
  Calendar,
  Save,
  CheckCircle2,
  X
} from 'lucide-react';
import Image from 'next/image';

interface ShowcaseItem {
  id: string;
  title: string;
  description: string;
  category: 'Audio Pack' | 'Software Utility' | 'Digital Artwork' | 'Writing' | 'Other';
  link: string;
  image: string;
  year: string;
}

// Curated avatar seeds to make selection fun & zero-trust themed
const AVATAR_SEEDS = [
  'abstract_neon',
  'cyberspace_node',
  'sovereign_art',
  'matrix_glow',
  'cryptography_key'
];

const DEFAULT_SHOWCASE: ShowcaseItem[] = [];

export default function Profile() {
  const { user } = useAuth();
  
  // --- Profile state ---
  const [isEditMode, setIsEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('Verified Sovereign IP Creator');
  const [profilePic, setProfilePic] = useState('/duane_portrait.jpg');
  const [website, setWebsite] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [github, setGithub] = useState('');
  const [youtube, setYoutube] = useState('');
  
  // --- Showcase state ---
  const [showcaseList, setShowcaseList] = useState<ShowcaseItem[]>(DEFAULT_SHOWCASE);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // --- New Showcase Item Form State ---
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<'Audio Pack' | 'Software Utility' | 'Digital Artwork' | 'Writing' | 'Other'>('Digital Artwork');
  const [newLink, setNewLink] = useState('');
  const [newImageSeed, setNewImageSeed] = useState('creation');
  const [newYear, setNewYear] = useState('2026');

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedName = localStorage.getItem('sov_profile_name');
    const savedBio = localStorage.getItem('sov_profile_bio');
    const savedPic = localStorage.getItem('sov_profile_pic');
    const savedWebsite = localStorage.getItem('sov_profile_website');
    const savedTwitter = localStorage.getItem('sov_profile_twitter');
    const savedInstagram = localStorage.getItem('sov_profile_instagram');
    const savedGithub = localStorage.getItem('sov_profile_github');
    const savedYoutube = localStorage.getItem('sov_profile_youtube');
    const savedShowcase = localStorage.getItem('sov_profile_showcase');

    if (savedName !== null) setDisplayName(savedName);
    else if (user) setDisplayName(user.displayName || user.email?.split('@')[0] || 'Sovereign Artist');
    
    if (savedBio !== null) setBio(savedBio);
    if (savedPic !== null) setProfilePic(savedPic);
    if (savedWebsite !== null) setWebsite(savedWebsite);
    if (savedTwitter !== null) setTwitter(savedTwitter);
    if (savedInstagram !== null) setInstagram(savedInstagram);
    if (savedGithub !== null) setGithub(savedGithub);
    if (savedYoutube !== null) setYoutube(savedYoutube);
    if (savedShowcase !== null) {
      try {
        setShowcaseList(JSON.parse(savedShowcase));
      } catch (e) {
        console.error('Failed to parse saved showcase:', e);
      }
    }
  }, [user]);

  // Handle Save
  const handleSaveProfile = () => {
    setSaveStatus('saving');
    
    localStorage.setItem('sov_profile_name', displayName);
    localStorage.setItem('sov_profile_bio', bio);
    localStorage.setItem('sov_profile_pic', profilePic);
    localStorage.setItem('sov_profile_website', website);
    localStorage.setItem('sov_profile_twitter', twitter);
    localStorage.setItem('sov_profile_instagram', instagram);
    localStorage.setItem('sov_profile_github', github);
    localStorage.setItem('sov_profile_youtube', youtube);
    localStorage.setItem('sov_profile_showcase', JSON.stringify(showcaseList));

    setTimeout(() => {
      setSaveStatus('saved');
      setIsEditMode(false);
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  // Add new showcase item
  const handleAddShowcase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ShowcaseItem = {
      id: 'sc-' + Date.now(),
      title: newTitle,
      description: newDescription,
      category: newCategory,
      link: newLink || '#',
      image: `https://picsum.photos/seed/${newImageSeed || 'artwork'}/400/250`,
      year: newYear || '2026'
    };

    const updatedList = [...showcaseList, newItem];
    setShowcaseList(updatedList);
    localStorage.setItem('sov_profile_showcase', JSON.stringify(updatedList));

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewCategory('Digital Artwork');
    setNewLink('');
    setNewImageSeed('creation');
    setNewYear('2026');
    setShowAddModal(false);
  };

  // Remove showcase item
  const handleRemoveShowcase = (id: string) => {
    const updatedList = showcaseList.filter(item => item.id !== id);
    setShowcaseList(updatedList);
    localStorage.setItem('sov_profile_showcase', JSON.stringify(updatedList));
  };

  // Randomize abstract avatar seed
  const randomizeAvatar = () => {
    const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
    const uniqueNumber = Math.floor(Math.random() * 1000);
    setProfilePic(`https://picsum.photos/seed/${randomSeed}_${uniqueNumber}/150/150`);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Audio Pack': return <Music className="w-3.5 h-3.5 text-cyan-400" />;
      case 'Software Utility': return <Code className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Digital Artwork': return <Layers className="w-3.5 h-3.5 text-violet-400" />;
      case 'Writing': return <BookOpen className="w-3.5 h-3.5 text-amber-400" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-pink-400" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Upper Navigation Toggle Mode */}
      <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight uppercase flex items-center gap-2">
            <User className="w-5 h-5 text-cyan-400" />
            Sovereign Creator Portfolio
          </h2>
          <p className="text-xs text-zinc-500 font-mono mt-0.5">Manage digital profile information and showcased assets</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(false)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              !isEditMode 
                ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-400' 
                : 'bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4" />
            Public View
          </button>
          <button
            onClick={() => setIsEditMode(true)}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-colors ${
              isEditMode 
                ? 'bg-cyan-950/40 border border-cyan-500/30 text-cyan-400' 
                : 'bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            Edit Info
          </button>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Profile Card & Socials */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Main Identity Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden text-center shadow-xl">
            {/* Ambient cyber mesh glow in card header */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
            
            {/* Avatar block */}
            <div className="relative w-28 h-28 mx-auto mt-4 mb-4 group">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500 via-violet-500 to-emerald-500 animate-spin-slow blur-sm opacity-50" />
              <div className="relative w-full h-full rounded-full border-2 border-zinc-900 overflow-hidden bg-zinc-900">
                <Image 
                  src={profilePic} 
                  alt="Sovereign Creator Profile Picture" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              {isEditMode && (
                <button 
                  onClick={randomizeAvatar}
                  title="Randomize Abstract Art Avatar"
                  className="absolute bottom-0 right-0 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-cyan-400 hover:text-white transition-colors shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Verification Badge */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
              <div className="inline-flex items-center gap-1.5 bg-cyan-950/50 border border-cyan-500/20 px-3 py-1 rounded-full text-[10px] font-mono text-cyan-400 font-bold">
                <BadgeCheck className="w-3.5 h-3.5" />
                Verified Sovereign Creator
              </div>
              <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-yellow-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-[10px] font-mono text-amber-300 font-bold shadow-sm" title="Founders Beta Creator (Top 100 Early Adopters)">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Founders Beta #042
              </div>
            </div>

            {/* Display Name */}
            {isEditMode ? (
              <div className="space-y-1.5 px-2">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block text-left">Creator Alias</label>
                <input 
                  type="text" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Jane Creator"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            ) : (
              <h3 className="text-lg font-bold text-white tracking-tight">{displayName || 'Anonymous Creator'}</h3>
            )}

            {/* Bio Segment */}
            {isEditMode ? (
              <div className="space-y-1.5 mt-4 px-2 text-left">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block">Bio Descriptor</label>
                <textarea 
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell other builders about your creations..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>
            ) : (
              <p className="text-zinc-400 text-xs mt-3 leading-relaxed px-4 italic">&ldquo;{bio}&rdquo;</p>
            )}

            {/* Public Links in View Mode */}
            {!isEditMode && (
              <div className="pt-6 mt-6 border-t border-zinc-900 space-y-2">
                <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-500 block text-left">Verified Contacts</span>
                
                {website && (
                  <a 
                    href={website} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition-colors text-xs text-zinc-300"
                  >
                    <span className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" />
                      Portfolio
                    </span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </a>
                )}

                <div className="grid grid-cols-4 gap-2">
                  {twitter && (
                    <a 
                      href={`https://x.com/${twitter}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title={`Twitter: @${twitter}`}
                      className="p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition-colors flex justify-center"
                    >
                      <Twitter className="w-4 h-4 text-sky-400" />
                    </a>
                  )}

                  {youtube && (
                    <a 
                      href={youtube.startsWith('http') ? youtube : `https://youtube.com/@${youtube}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title={`YouTube: ${youtube}`}
                      className="p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition-colors flex justify-center"
                    >
                      <Youtube className="w-4 h-4 text-red-500" />
                    </a>
                  )}

                  {github && (
                    <a 
                      href={`https://github.com/${github}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title={`GitHub: ${github}`}
                      className="p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition-colors flex justify-center"
                    >
                      <Github className="w-4 h-4 text-zinc-300" />
                    </a>
                  )}

                  {instagram && (
                    <a 
                      href={`https://instagram.com/${instagram}`} 
                      target="_blank" 
                      rel="noreferrer" 
                      title={`Instagram: @${instagram}`}
                      className="p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-800 transition-colors flex justify-center"
                    >
                      <Instagram className="w-4 h-4 text-pink-400" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Configuration Fields for Socials in Edit Mode */}
          {isEditMode && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 space-y-4 shadow-xl text-left">
              <h4 className="text-xs font-mono uppercase font-black tracking-wider text-white border-b border-zinc-900 pb-2">
                External Web Channels
              </h4>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" /> Web Page URL
                </label>
                <input 
                  type="text" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://myportfolio.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block flex items-center gap-1.5">
                  <Twitter className="w-3.5 h-3.5 text-sky-400" /> X / Twitter Alias
                </label>
                <input 
                  type="text" 
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  placeholder="jane_creator"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block flex items-center gap-1.5">
                  <Youtube className="w-3.5 h-3.5 text-red-500" /> YouTube Channel / URL
                </label>
                <input 
                  type="text" 
                  value={youtube}
                  onChange={(e) => setYoutube(e.target.value)}
                  placeholder="jane_creator_official"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-zinc-300" /> GitHub Account
                </label>
                <input 
                  type="text" 
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  placeholder="jane-creator-git"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-mono uppercase text-zinc-500 tracking-wider font-bold block flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-pink-400" /> Instagram Handle
                </label>
                <input 
                  type="text" 
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="jane.creates"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                disabled={saveStatus === 'saving'}
                className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-violet-600 hover:from-cyan-500 hover:to-violet-500 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg"
              >
                {saveStatus === 'saving' ? (
                  <Sparkles className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Commit Saved Changes
                  </>
                )}
              </button>

              {saveStatus === 'saved' && (
                <div className="text-center text-xs text-emerald-400 flex items-center justify-center gap-1.5 bg-emerald-950/20 border border-emerald-500/10 p-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  Ledger profile updated successfully.
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Column: Featured Portoflio & Showcase Items */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Header of Showcase section */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-900">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  Featured Creation Showcase
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">Exhibit active media files and software releases to potential licensing licensees</p>
              </div>

              {/* Add Showcase Item Trigger */}
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900 border border-cyan-500/20 text-cyan-400 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5 self-start"
              >
                <PlusCircle className="w-4 h-4" />
                Expose New Work
              </button>
            </div>

            {/* Showcase Grid */}
            {showcaseList.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <ImageIcon className="w-12 h-12 text-zinc-700 mx-auto animate-pulse" />
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Showcase Empty</h4>
                <p className="text-zinc-500 text-xs max-w-sm mx-auto leading-relaxed">
                  Start exhibiting your best creations! Click the button above to register an absolute spotlight block.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                {showcaseList.map((item) => (
                  <div 
                    key={item.id} 
                    className="group bg-[#09090b] border border-zinc-900 rounded-2xl overflow-hidden hover:border-cyan-500/20 transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Media banner */}
                    <div className="relative h-40 bg-zinc-900">
                      <Image 
                        src={item.image} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-zinc-800 text-[9px] font-mono text-zinc-400 flex items-center gap-1.5">
                        {getCategoryIcon(item.category)}
                        {item.category}
                      </div>

                      <div className="absolute top-3 right-3 bg-zinc-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg border border-zinc-800 text-[9px] font-mono text-zinc-400">
                        {item.year}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white leading-snug truncate group-hover:text-cyan-400 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-zinc-400 text-xs line-clamp-3 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* CTA Links or Deletion options */}
                      <div className="flex items-center justify-between mt-5 pt-3 border-t border-zinc-900">
                        <a 
                          href={item.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="text-xs text-cyan-400 hover:text-cyan-300 font-mono font-bold flex items-center gap-1 transition-colors"
                        >
                          Explore Build
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        {isEditMode && (
                          <button
                            onClick={() => handleRemoveShowcase(item.id)}
                            title="Remove item from showcase"
                            className="p-1.5 rounded-lg bg-red-955/20 hover:bg-red-950 border border-red-500/10 text-red-400 hover:text-red-300 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Zero Trust Credentials Guard */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="p-3 bg-cyan-950/30 border border-cyan-500/20 rounded-2xl self-start sm:self-center">
              <Calendar className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-mono uppercase text-white font-extrabold tracking-wide">
                On-Chain Integrity Verification
              </h4>
              <p className="text-zinc-500 text-xs leading-relaxed max-w-xl">
                Portfolios hosted under Sovranly IP rely on active session cryptography. Modifying public parameters requires verifying key alignment with your connected Web3 address or auth envelope.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* Expose New Work Modal Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl w-full max-w-lg p-6 relative shadow-2xl text-left">
            <button 
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-white uppercase tracking-tight flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              Expose Showcase Piece
            </h3>
            <p className="text-xs text-zinc-500 mb-6">Create a featured asset item for visitors on your portfolio view.</p>

            <form onSubmit={handleAddShowcase} className="space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Asset Title</label>
                <input 
                  type="text" 
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Genesis Concept Art"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Digital Artwork">Digital Artwork</option>
                    <option value="Audio Pack">Audio Pack</option>
                    <option value="Software Utility">Software Utility</option>
                    <option value="Writing">Writing / Editorial</option>
                    <option value="Other">Other Category</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Year</label>
                  <input 
                    type="text" 
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    placeholder="2026"
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Expose Web / Build URL</label>
                <input 
                  type="text" 
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  placeholder="https://mycreation-demo.com"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Visual Style Theme (Image Randomizer Seed)</label>
                <input 
                  type="text" 
                  value={newImageSeed}
                  onChange={(e) => setNewImageSeed(e.target.value)}
                  placeholder="e.g. cyber, modular, retro, galaxy"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase text-zinc-400 font-bold block">Description Details</label>
                <textarea 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize key details of this asset..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-xs font-mono font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold transition-all shadow-lg"
                >
                  Expose to Ledger
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
