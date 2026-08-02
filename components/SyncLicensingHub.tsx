'use client';

import React, { useState } from 'react';
import {
  Music,
  Film,
  Radio,
  ShieldCheck,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle2,
  FileText,
  DollarSign,
  Users,
  Award,
  Sparkles,
  Download,
  Copy,
  ExternalLink,
  PlusCircle,
  Sliders,
  Layers,
  ArrowRight,
  Clock,
  Globe,
  Tag,
  Share2,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SyncRoyaltySplit {
  name: string;
  role: string;
  percentage: number;
  wallet: string;
}

export interface SyncTrack {
  id: string;
  title: string;
  artist: string;
  genre: 'Synthwave' | 'Orchestral' | 'Electronic' | 'Indie Rock' | 'Ambient' | 'Cinematic';
  mood: 'Cinematic' | 'Cyberpunk' | 'Ethereal' | 'High-Energy' | 'Dark Ambient' | 'Uplifting';
  bpm: number;
  duration: string;
  isrc: string;
  masterRightsOwner: string;
  publishingRightsOwner: string;
  splits: SyncRoyaltySplit[];
  pricing: {
    indie: number; // Indie Creator / Low Budget ($150 - $300)
    commercial: number; // Corporate Web Commercial ($1,200 - $3,500)
    broadcast: number; // Global Broadcast & AAA Game ($8,500 - $25,000)
  };
  featured?: boolean;
}

export interface IssuedSyncLicense {
  id: string;
  trackId: string;
  trackTitle: string;
  artist: string;
  licenseeName: string;
  projectTitle: string;
  tier: 'Indie Creator' | 'Corporate Web Commercial' | 'Global Broadcast & AAA Game';
  amountPaid: number;
  issuedAt: string;
  txHash: string;
  certificateId: string;
  splitsPaid: { name: string; amount: number; wallet: string }[];
}

const INITIAL_CATALOG: SyncTrack[] = [
  {
    id: 'SYNC-2084-01',
    title: 'Neon Skyline 2084',
    artist: 'Aurelia Synth & Kaelen Voss',
    genre: 'Synthwave',
    mood: 'Cyberpunk',
    bpm: 118,
    duration: '3:45',
    isrc: 'US-SVR-26-00101',
    masterRightsOwner: 'Aurelia Synth (50%) / Voss Media (50%)',
    publishingRightsOwner: 'Sovranly Publishing Compact #942',
    splits: [
      { name: 'Aurelia Synth', role: 'Composer / Producer', percentage: 50, wallet: '0x71C...4E8B' },
      { name: 'Kaelen Voss', role: 'Co-Producer / Sound Design', percentage: 30, wallet: '0x99A...11D3' },
      { name: 'Sovranly Publishing', role: 'Publishing Admin', percentage: 20, wallet: '0x32F...88F1' }
    ],
    pricing: {
      indie: 180,
      commercial: 1850,
      broadcast: 14500
    },
    featured: true
  },
  {
    id: 'SYNC-2084-02',
    title: 'Valhalla Ascending (Orchestral Suite)',
    artist: 'Nordic Philharmonic & Elena Rostova',
    genre: 'Orchestral',
    mood: 'Cinematic',
    bpm: 94,
    duration: '4:12',
    isrc: 'US-SVR-26-00102',
    masterRightsOwner: 'Elena Rostova (100%)',
    publishingRightsOwner: 'Rostova Classical Rights',
    splits: [
      { name: 'Elena Rostova', role: 'Composer & Conductor', percentage: 70, wallet: '0x44B...99C2' },
      { name: 'Nordic Philharmonic', role: 'Orchestra Master Recording', percentage: 30, wallet: '0x88D...33B7' }
    ],
    pricing: {
      indie: 250,
      commercial: 2400,
      broadcast: 18000
    },
    featured: true
  },
  {
    id: 'SYNC-2084-03',
    title: 'Cybernetic Dawn (Main Title)',
    artist: 'Vector Pulse',
    genre: 'Electronic',
    mood: 'High-Energy',
    bpm: 132,
    duration: '2:58',
    isrc: 'US-SVR-26-00103',
    masterRightsOwner: 'Vector Pulse Studio (100%)',
    publishingRightsOwner: 'Vector Pulse Publishing',
    splits: [
      { name: 'Vector Pulse', role: 'Lead Artist & Composer', percentage: 85, wallet: '0x12E...77A9' },
      { name: 'Marcus Chen', role: 'Mastering Engineer', percentage: 15, wallet: '0x55F...22C4' }
    ],
    pricing: {
      indie: 150,
      commercial: 1400,
      broadcast: 9500
    }
  },
  {
    id: 'SYNC-2084-04',
    title: 'Solar Drift Ambient Suite',
    artist: 'Lyra K & Horizon Echo',
    genre: 'Ambient',
    mood: 'Ethereal',
    bpm: 78,
    duration: '5:20',
    isrc: 'US-SVR-26-00104',
    masterRightsOwner: 'Horizon Echo Records (100%)',
    publishingRightsOwner: 'Horizon Echo Songs',
    splits: [
      { name: 'Lyra K', role: 'Composer / Vocalist', percentage: 60, wallet: '0x66C...44E1' },
      { name: 'Horizon Echo', role: 'Producer / Sound Designer', percentage: 40, wallet: '0x33B...88A2' }
    ],
    pricing: {
      indie: 200,
      commercial: 1600,
      broadcast: 11000
    }
  },
  {
    id: 'SYNC-2084-05',
    title: 'Eclipse of the Sun (Trailer Cut)',
    artist: 'Vespera Cinematic',
    genre: 'Cinematic',
    mood: 'Dark Ambient',
    bpm: 105,
    duration: '2:30',
    isrc: 'US-SVR-26-00105',
    masterRightsOwner: 'Vespera Cinematic Collective',
    publishingRightsOwner: 'Vespera Publishing',
    splits: [
      { name: 'Vespera Studio', role: 'Composer', percentage: 75, wallet: '0x99D...00C8' },
      { name: 'Sovereign Sync Vault', role: 'Catalog Distributor', percentage: 25, wallet: '0x77A...55F3' }
    ],
    pricing: {
      indie: 280,
      commercial: 3200,
      broadcast: 22000
    },
    featured: true
  },
  {
    id: 'SYNC-2084-06',
    title: 'High-Voltage Pursuit',
    artist: 'Apex Apex',
    genre: 'Electronic',
    mood: 'High-Energy',
    bpm: 140,
    duration: '3:15',
    isrc: 'US-SVR-26-00106',
    masterRightsOwner: 'Apex Apex (100%)',
    publishingRightsOwner: 'Apex Apex Publishing',
    splits: [
      { name: 'Apex Apex', role: 'Composer & Performer', percentage: 100, wallet: '0x88A...12D9' }
    ],
    pricing: {
      indie: 160,
      commercial: 1500,
      broadcast: 10500
    }
  }
];

const INITIAL_LICENSES: IssuedSyncLicense[] = [
  {
    id: 'LIC-SYNC-901',
    trackId: 'SYNC-2084-01',
    trackTitle: 'Neon Skyline 2084',
    artist: 'Aurelia Synth & Kaelen Voss',
    licenseeName: 'Cyber Studios interactive LLC',
    projectTitle: 'Neo-Tokyo Overdrive (AAA Game)',
    tier: 'Global Broadcast & AAA Game',
    amountPaid: 14500,
    issuedAt: '2026-08-01 14:32:00 UTC',
    txHash: '0x8f7d9a1e4c3b2084991c7a88432ef10c66a4f9102837bc5d7c81a29900f1c321',
    certificateId: 'SVR-CERT-8841-A',
    splitsPaid: [
      { name: 'Aurelia Synth', amount: 7250, wallet: '0x71C...4E8B' },
      { name: 'Kaelen Voss', amount: 4350, wallet: '0x99A...11D3' },
      { name: 'Sovranly Publishing', amount: 2900, wallet: '0x32F...88F1' }
    ]
  },
  {
    id: 'LIC-SYNC-902',
    trackId: 'SYNC-2084-05',
    trackTitle: 'Eclipse of the Sun (Trailer Cut)',
    artist: 'Vespera Cinematic',
    licenseeName: 'Apex Horizon Pictures',
    projectTitle: 'The Silent Orbit (Theatrical Trailer #1)',
    tier: 'Corporate Web Commercial',
    amountPaid: 3200,
    issuedAt: '2026-07-28 09:15:22 UTC',
    txHash: '0x3a4b9c1d8e2f7a601928374655a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8',
    certificateId: 'SVR-CERT-7732-B',
    splitsPaid: [
      { name: 'Vespera Studio', amount: 2400, wallet: '0x99D...00C8' },
      { name: 'Sovereign Sync Vault', amount: 800, wallet: '0x77A...55F3' }
    ]
  }
];

export default function SyncLicensingHub({
  walletAddress
}: {
  walletAddress?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<'storefront' | 'catalog' | 'ledger'>('storefront');
  const [catalog, setCatalog] = useState<SyncTrack[]>(INITIAL_CATALOG);
  const [issuedLicenses, setIssuedLicenses] = useState<IssuedSyncLicense[]>(INITIAL_LICENSES);

  // Filter & Search state for Storefront
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string>('All');
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);

  // Checkout Modal State
  const [checkoutTrack, setCheckoutTrack] = useState<SyncTrack | null>(null);
  const [selectedTier, setSelectedTier] = useState<'indie' | 'commercial' | 'broadcast'>('commercial');
  const [projectTitleInput, setProjectTitleInput] = useState('');
  const [licenseeNameInput, setLicenseeNameInput] = useState('Sovereign Interactive / Video Production Co.');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCertificateModal, setActiveCertificateModal] = useState<IssuedSyncLicense | null>(null);

  // New Track Registration Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newGenre, setNewGenre] = useState<'Synthwave' | 'Orchestral' | 'Electronic' | 'Indie Rock' | 'Ambient' | 'Cinematic'>('Synthwave');
  const [newMood, setNewMood] = useState<'Cinematic' | 'Cyberpunk' | 'Ethereal' | 'High-Energy' | 'Dark Ambient' | 'Uplifting'>('Cinematic');
  const [newBpm, setNewBpm] = useState('120');
  const [newDuration, setNewDuration] = useState('3:15');
  const [indiePrice, setIndiePrice] = useState('200');
  const [commercialPrice, setCommercialPrice] = useState('1800');
  const [broadcastPrice, setBroadcastPrice] = useState('12000');
  const [composerName, setComposerName] = useState('');
  const [composerSplit, setComposerSplit] = useState('60');
  const [producerName, setProducerName] = useState('');
  const [producerSplit, setProducerSplit] = useState('40');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Filter Storefront Tracks
  const filteredTracks = catalog.filter((track) => {
    const matchesSearch =
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.mood.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMood === 'All' || track.mood === selectedMood;
    const matchesGenre = selectedGenre === 'All' || track.genre === selectedGenre;
    return matchesSearch && matchesMood && matchesGenre;
  });

  // Handle Play/Pause Preview
  const handleTogglePlay = (trackId: string) => {
    if (playingTrackId === trackId) {
      setPlayingTrackId(null);
    } else {
      setPlayingTrackId(trackId);
    }
  };

  // Open Checkout Modal
  const openCheckout = (track: SyncTrack, tier: 'indie' | 'commercial' | 'broadcast') => {
    setCheckoutTrack(track);
    setSelectedTier(tier);
    setProjectTitleInput('');
  };

  // Execute Smart Contract & Issue Sync License Certificate
  const handleExecuteSyncLicense = () => {
    if (!checkoutTrack) return;
    setIsProcessing(true);

    setTimeout(() => {
      const tierLabel =
        selectedTier === 'indie'
          ? 'Indie Creator'
          : selectedTier === 'commercial'
          ? 'Corporate Web Commercial'
          : 'Global Broadcast & AAA Game';

      const amountPaid =
        selectedTier === 'indie'
          ? checkoutTrack.pricing.indie
          : selectedTier === 'commercial'
          ? checkoutTrack.pricing.commercial
          : checkoutTrack.pricing.broadcast;

      const randomHex = Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      const randomCert = `SVR-CERT-${Math.floor(1000 + Math.random() * 9000)}-SYNC`;

      // Calculate automated split payout
      const splitsPaid = checkoutTrack.splits.map((split) => ({
        name: split.name,
        amount: Number(((amountPaid * split.percentage) / 100).toFixed(2)),
        wallet: split.wallet
      }));

      const newLicense: IssuedSyncLicense = {
        id: `LIC-SYNC-${Math.floor(100 + Math.random() * 900)}`,
        trackId: checkoutTrack.id,
        trackTitle: checkoutTrack.title,
        artist: checkoutTrack.artist,
        licenseeName: licenseeNameInput || 'Authorized Creator / Media Producer',
        projectTitle: projectTitleInput || 'Untitled Commercial Media Project',
        tier: tierLabel,
        amountPaid,
        issuedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
        txHash: '0x' + randomHex,
        certificateId: randomCert,
        splitsPaid
      };

      setIssuedLicenses([newLicense, ...issuedLicenses]);
      setIsProcessing(false);
      setCheckoutTrack(null);
      setActiveCertificateModal(newLicense);
    }, 1200);
  };

  // Handle new track registration
  const handleRegisterNewTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newArtist) return;

    const totalSplit = Number(composerSplit) + Number(producerSplit);
    if (totalSplit !== 100) {
      alert('Total royalty percentages must equal 100%. Currently: ' + totalSplit + '%');
      return;
    }

    const newTrack: SyncTrack = {
      id: `SYNC-2084-0${catalog.length + 1}`,
      title: newTitle,
      artist: newArtist,
      genre: newGenre,
      mood: newMood,
      bpm: Number(newBpm) || 120,
      duration: newDuration || '3:30',
      isrc: `US-SVR-26-0010${catalog.length + 1}`,
      masterRightsOwner: `${composerName || newArtist} (${composerSplit}%) / ${producerName || 'Producer Studio'} (${producerSplit}%)`,
      publishingRightsOwner: 'Sovranly Publishing Compact #945',
      splits: [
        {
          name: composerName || newArtist,
          role: 'Composer / Rights Holder',
          percentage: Number(composerSplit),
          wallet: walletAddress || '0x71C...4E8B'
        },
        {
          name: producerName || 'Co-Producer Studio',
          role: 'Producer / Master Owner',
          percentage: Number(producerSplit),
          wallet: '0x88A...12D9'
        }
      ],
      pricing: {
        indie: Number(indiePrice) || 200,
        commercial: Number(commercialPrice) || 1800,
        broadcast: Number(broadcastPrice) || 12000
      }
    };

    setCatalog([newTrack, ...catalog]);
    setRegistrationSuccess(true);
    setNewTitle('');
    setNewArtist('');
    setComposerName('');
    setProducerName('');

    setTimeout(() => {
      setRegistrationSuccess(false);
      setActiveTab('storefront');
    }, 1500);
  };

  return (
    <div className="space-y-8 font-sans pb-16">
      {/* Top Hero Header */}
      <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-cyan-950/40 p-6 sm:p-8 md:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-violet-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Automated Sync Licensing &amp; Instant Clearance Storefront</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Sovereign <span className="text-cyan-400">Sync Licensing</span>
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-light">
              Replace multi-week manual clearance bottlenecks with instant, programmatic synchronization licenses for <strong className="text-white font-semibold">video games, films, commercials, and digital content</strong>. Smart contracts automatically process fees and split royalties programmatically among co-writers and producers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full md:w-auto">
            <Button
              onClick={() => setActiveTab('storefront')}
              variant={activeTab === 'storefront' ? 'default' : 'outline'}
              className={`rounded-xl px-5 py-6 font-bold text-xs uppercase tracking-wider ${
                activeTab === 'storefront'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white border-0 shadow-lg shadow-cyan-950/50'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <Music className="w-4 h-4 mr-2" />
              Clearance Storefront ({catalog.length})
            </Button>
            <Button
              onClick={() => setActiveTab('catalog')}
              variant={activeTab === 'catalog' ? 'default' : 'outline'}
              className={`rounded-xl px-5 py-6 font-bold text-xs uppercase tracking-wider ${
                activeTab === 'catalog'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white border-0 shadow-lg shadow-cyan-950/50'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4 mr-2 text-cyan-400" />
              Register Sync Track
            </Button>
            <Button
              onClick={() => setActiveTab('ledger')}
              variant={activeTab === 'ledger' ? 'default' : 'outline'}
              className={`rounded-xl px-5 py-6 font-bold text-xs uppercase tracking-wider ${
                activeTab === 'ledger'
                  ? 'bg-gradient-to-r from-cyan-500 to-violet-500 text-white border-0 shadow-lg shadow-cyan-950/50'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 mr-2 text-emerald-400" />
              Issued Licenses ({issuedLicenses.length})
            </Button>
          </div>
        </div>
      </div>

      {/* THREE UPFRONT SYNC TIERS INFO STRIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center shrink-0 text-violet-400 font-mono font-bold">
            01
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Indie Creator Tier
              </h3>
              <span className="text-xs font-mono text-violet-400 font-bold">$150 - $300</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Instant worldwide synchronization for YouTube, independent podcasts, short films, and indie video game releases (&lt;50k distribution).
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-cyan-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400 font-mono font-bold">
            02
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Corporate Web Commercial
              </h3>
              <span className="text-xs font-mono text-cyan-400 font-bold">$1,200 - $3,500</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Full worldwide digital commercial rights for corporate ads, web campaigns, OTT streaming series, and AA game studios.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 font-mono font-bold">
            03
          </div>
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Global Broadcast &amp; AAA Game
              </h3>
              <span className="text-xs font-mono text-emerald-400 font-bold">$8,500 - $25,000</span>
            </div>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
              Perpetual master &amp; publishing buyout for worldwide television, theatrical trailers, and AAA video game franchises.
            </p>
          </div>
        </div>
      </div>

      {/* TAB 1: INSTANT CLEARANCE STOREFRONT */}
      {activeTab === 'storefront' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search catalog by track title, artist, genre, or mood..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 mr-1">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                Mood:
              </span>
              {(['All', 'Cinematic', 'Cyberpunk', 'Ethereal', 'High-Energy', 'Dark Ambient'] as const).map(
                (mood) => (
                  <button
                    key={mood}
                    onClick={() => setSelectedMood(mood)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedMood === mood
                        ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {mood}
                  </button>
                )
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 mr-1">
                Genre:
              </span>
              {(['All', 'Synthwave', 'Orchestral', 'Electronic', 'Ambient', 'Cinematic'] as const).map(
                (genre) => (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      selectedGenre === genre
                        ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {genre}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Catalog Track List */}
          <div className="space-y-4">
            {filteredTracks.map((track) => {
              const isPlaying = playingTrackId === track.id;

              return (
                <div
                  key={track.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    track.featured
                      ? 'bg-gradient-to-r from-zinc-900 via-zinc-900 to-cyan-950/20 border-cyan-500/40 hover:border-cyan-400/80 shadow-xl'
                      : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Track identity & preview toggle */}
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <button
                        onClick={() => handleTogglePlay(track.id)}
                        className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all cursor-pointer shadow-lg ${
                          isPlaying
                            ? 'bg-cyan-500 text-zinc-950 animate-pulse scale-105'
                            : 'bg-zinc-800 border border-zinc-700 text-cyan-400 hover:bg-zinc-700'
                        }`}
                        title={isPlaying ? 'Pause Audio Preview' : 'Preview Track'}
                      >
                        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base sm:text-lg font-bold text-white truncate">
                            {track.title}
                          </h3>
                          {track.featured && (
                            <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                              Verified Master
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-mono">
                            ISRC: {track.isrc}
                          </span>
                        </div>

                        <p className="text-xs text-zinc-400 font-medium mb-2">
                          By <span className="text-white font-semibold">{track.artist}</span>
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-cyan-300 font-mono text-[11px]">
                            <Music className="w-3 h-3 text-cyan-400" />
                            {track.genre}
                          </span>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-950 border border-zinc-800 text-violet-300 font-mono text-[11px]">
                            <Sparkles className="w-3 h-3 text-violet-400" />
                            {track.mood}
                          </span>
                          <span className="font-mono text-zinc-500 text-xs">
                            {track.bpm} BPM
                          </span>
                          <span className="font-mono text-zinc-500 text-xs">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {track.duration}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Middle: Live simulated audio waveform visualizer */}
                    <div className="hidden xl:flex items-center gap-1 h-10 px-4 bg-zinc-950/80 rounded-xl border border-zinc-800">
                      {[
                        30, 60, 45, 80, 50, 90, 70, 40, 65, 85, 55, 75, 45, 60, 35, 70, 90, 60, 40, 50
                      ].map((h, i) => (
                        <div
                          key={i}
                          className={`w-1.5 rounded-full transition-all duration-300 ${
                            isPlaying
                              ? 'bg-cyan-400 animate-pulse'
                              : 'bg-zinc-700'
                          }`}
                          style={{ height: `${isPlaying ? Math.max(20, (h * (i % 3 + 1)) % 100) : h}%` }}
                        />
                      ))}
                    </div>

                    {/* Right: Instant Clearance Tiers & Buy Action */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-zinc-800">
                      <div className="flex items-center gap-2">
                        {/* Indie Tier */}
                        <button
                          onClick={() => openCheckout(track, 'indie')}
                          className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-violet-500/60 text-left transition-all cursor-pointer group"
                        >
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono group-hover:text-violet-300">
                            Indie / Creator
                          </p>
                          <p className="text-sm font-bold text-white font-mono">
                            ${track.pricing.indie}
                          </p>
                        </button>

                        {/* Commercial Web Tier */}
                        <button
                          onClick={() => openCheckout(track, 'commercial')}
                          className="px-3.5 py-2 rounded-xl bg-cyan-950/30 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all cursor-pointer group"
                        >
                          <p className="text-[9px] uppercase tracking-wider text-cyan-400 font-mono font-bold">
                            Commercial
                          </p>
                          <p className="text-sm font-extrabold text-cyan-300 font-mono">
                            ${track.pricing.commercial}
                          </p>
                        </button>

                        {/* Broadcast Tier */}
                        <button
                          onClick={() => openCheckout(track, 'broadcast')}
                          className="px-3.5 py-2 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-emerald-500/60 text-left transition-all cursor-pointer group"
                        >
                          <p className="text-[9px] uppercase tracking-wider text-zinc-500 font-mono group-hover:text-emerald-300">
                            AAA / Broadcast
                          </p>
                          <p className="text-sm font-bold text-white font-mono">
                            ${track.pricing.broadcast.toLocaleString()}
                          </p>
                        </button>
                      </div>

                      <Button
                        onClick={() => openCheckout(track, 'commercial')}
                        className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-bold text-xs rounded-xl px-4 py-6 shadow-lg shadow-cyan-950/50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Instant Clearance
                      </Button>
                    </div>
                  </div>

                  {/* Royalty Split Breakdown drawer strip below */}
                  <div className="mt-4 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-500 font-mono text-[11px] uppercase tracking-wider">
                        Smart Contract Splits:
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {track.splits.map((split, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px]"
                          >
                            <span className="text-white font-semibold">{split.name}</span> ({split.percentage}%)
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      100% Automated On-chain Payout
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: REGISTER SYNC TRACK (CATALOG-TO-BUYER PIPELINE) */}
      {activeTab === 'catalog' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl space-y-6">
            <div className="border-b border-zinc-800 pb-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                Register Sync Catalog Track &amp; Configure Tiers
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Upload your master recording metadata, set upfront synchronization license prices, and assign automated Smart Contract royalty split percentages.
              </p>
            </div>

            {registrationSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 font-mono">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  Track successfully registered with cryptographic SHA-256 proof! Now live in the Instant Clearance Storefront.
                </span>
              </div>
            )}

            <form onSubmit={handleRegisterNewTrack} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="newTitleInput" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Track Title *
                  </label>
                  <input
                    id="newTitleInput"
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Cybernetic Horizon 2099"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label htmlFor="newArtistInput" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Artist / Composer Name *
                  </label>
                  <input
                    id="newArtistInput"
                    type="text"
                    required
                    value={newArtist}
                    onChange={(e) => setNewArtist(e.target.value)}
                    placeholder="e.g. Kaelen Voss Studio"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="genreSelect" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Genre
                  </label>
                  <select
                    id="genreSelect"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value as SyncTrack['genre'])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Synthwave">Synthwave</option>
                    <option value="Orchestral">Orchestral</option>
                    <option value="Electronic">Electronic</option>
                    <option value="Indie Rock">Indie Rock</option>
                    <option value="Ambient">Ambient</option>
                    <option value="Cinematic">Cinematic</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="moodSelect" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Primary Mood
                  </label>
                  <select
                    id="moodSelect"
                    value={newMood}
                    onChange={(e) => setNewMood(e.target.value as SyncTrack['mood'])}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Cinematic">Cinematic</option>
                    <option value="Cyberpunk">Cyberpunk</option>
                    <option value="Ethereal">Ethereal</option>
                    <option value="High-Energy">High-Energy</option>
                    <option value="Dark Ambient">Dark Ambient</option>
                    <option value="Uplifting">Uplifting</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="newBpmInput" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    BPM (Tempo)
                  </label>
                  <input
                    id="newBpmInput"
                    type="number"
                    value={newBpm}
                    onChange={(e) => setNewBpm(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label htmlFor="newDurationInput" className="block text-xs font-mono text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Duration (mm:ss)
                  </label>
                  <input
                    id="newDurationInput"
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* THREE SYNC PRICING TIERS CONFIG */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Upfront Sync Licensing Pricing Tiers (USD)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="indiePriceInput" className="block text-xs font-mono text-zinc-400 mb-1">
                      Indie Creator Tier ($)
                    </label>
                    <input
                      id="indiePriceInput"
                      type="number"
                      value={indiePrice}
                      onChange={(e) => setIndiePrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="commercialPriceInput" className="block text-xs font-mono text-zinc-400 mb-1">
                      Corporate Web Commercial ($)
                    </label>
                    <input
                      id="commercialPriceInput"
                      type="number"
                      value={commercialPrice}
                      onChange={(e) => setCommercialPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-cyan-500/40 rounded-xl px-3 py-2 text-xs font-mono text-cyan-300 font-bold"
                    />
                  </div>
                  <div>
                    <label htmlFor="broadcastPriceInput" className="block text-xs font-mono text-zinc-400 mb-1">
                      Global Broadcast &amp; AAA Game ($)
                    </label>
                    <input
                      id="broadcastPriceInput"
                      type="number"
                      value={broadcastPrice}
                      onChange={(e) => setBroadcastPrice(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs font-mono text-white"
                    />
                  </div>
                </div>
              </div>

              {/* SMART CONTRACT ROYALTY SPLITS CONFIG */}
              <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Automated Smart Contract Royalty Splits
                  </h3>
                  <span className="text-xs font-mono text-zinc-400">
                    Total: <strong className="text-white font-bold">{Number(composerSplit) + Number(producerSplit)}%</strong> / 100%
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <label htmlFor="composerNameInput" className="block text-[11px] font-mono text-zinc-400 uppercase">
                      Composer / Co-Writer Name
                    </label>
                    <input
                      id="composerNameInput"
                      type="text"
                      placeholder="Your Name / Studio"
                      value={composerName}
                      onChange={(e) => setComposerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-mono">Split Percentage:</span>
                      <input
                        id="composerSplitInput"
                        type="number"
                        min="1"
                        max="99"
                        aria-label="Composer Royalty Split Percentage"
                        value={composerSplit}
                        onChange={(e) => setComposerSplit(e.target.value)}
                        className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-mono text-right"
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 space-y-2">
                    <label htmlFor="producerNameInput" className="block text-[11px] font-mono text-zinc-400 uppercase">
                      Producer / Master Recording Rights
                    </label>
                    <input
                      id="producerNameInput"
                      type="text"
                      placeholder="Co-Producer / Studio Partner"
                      value={producerName}
                      onChange={(e) => setProducerName(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-zinc-400 font-mono">Split Percentage:</span>
                      <input
                        id="producerSplitInput"
                        type="number"
                        min="1"
                        max="99"
                        aria-label="Producer Royalty Split Percentage"
                        value={producerSplit}
                        onChange={(e) => setProducerSplit(e.target.value)}
                        className="w-20 bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-xs text-white font-mono text-right"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-bold py-6 rounded-xl text-sm uppercase tracking-wider shadow-xl shadow-cyan-950/60"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Register Track &amp; Publish Sync License Tiers
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ISSUED SYNC LICENSES & BLOCKCHAIN CERTIFICATES LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">
                Issued Sync Licenses &amp; Transaction Ledger
              </h2>
              <p className="text-xs text-zinc-400">
                All time-stamped digital synchronization license certificates linked to immutable SHA-256 / On-chain transaction hashes.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {issuedLicenses.map((lic) => (
              <div
                key={lic.id}
                className="p-6 rounded-2xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                        {lic.tier}
                      </span>
                      <span className="text-xs font-mono text-zinc-500">
                        Certificate: <strong className="text-white">{lic.certificateId}</strong>
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white">
                      {lic.projectTitle}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Licensed to <strong className="text-white">{lic.licenseeName}</strong> • Track:{' '}
                      <strong className="text-cyan-300">{lic.trackTitle}</strong> by {lic.artist}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-[10px] font-mono text-zinc-500 uppercase">License Fee Paid</p>
                      <p className="text-xl font-extrabold text-white font-mono">
                        ${lic.amountPaid.toLocaleString()} USD
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveCertificateModal(lic)}
                      variant="outline"
                      className="border-cyan-500/40 bg-cyan-950/30 text-cyan-300 hover:text-white rounded-xl text-xs font-mono"
                    >
                      <FileText className="w-4 h-4 mr-1.5" />
                      View Certificate
                    </Button>
                  </div>
                </div>

                {/* Royalty Split Automated Payout Breakdown */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-zinc-500 font-mono uppercase text-[11px]">Programmatic Splits:</span>
                    {lic.splitsPaid.map((split, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px]"
                      >
                        <strong className="text-white">{split.name}</strong>: ${split.amount.toLocaleString()} ({split.wallet})
                      </span>
                    ))}
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 truncate max-w-sm">
                    Tx: <code className="text-cyan-400/80">{lic.txHash.slice(0, 18)}...{lic.txHash.slice(-8)}</code>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* INSTANT SYNC CLEARANCE CHECKOUT MODAL */}
      {checkoutTrack && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
                  Instant Sync License Checkout
                </h3>
              </div>
              <button
                onClick={() => setCheckoutTrack(null)}
                className="text-zinc-500 hover:text-white text-sm font-mono"
              >
                [Close]
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-mono text-zinc-400 uppercase">Selected Master Track</p>
                  <span className="text-xs font-mono text-cyan-400">{checkoutTrack.isrc}</span>
                </div>
                <h4 className="text-lg font-bold text-white">{checkoutTrack.title}</h4>
                <p className="text-xs text-zinc-400">By {checkoutTrack.artist}</p>
              </div>

              {/* Sync Tier Picker inside modal */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedTier('indie')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === 'indie'
                      ? 'bg-violet-500/20 border-violet-500/60 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-[10px] uppercase font-mono text-violet-400">Indie Creator</p>
                  <p className="text-sm font-mono font-bold text-white">${checkoutTrack.pricing.indie}</p>
                </button>
                <button
                  onClick={() => setSelectedTier('commercial')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === 'commercial'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-[10px] uppercase font-mono text-cyan-400">Commercial</p>
                  <p className="text-sm font-mono font-bold text-white">${checkoutTrack.pricing.commercial}</p>
                </button>
                <button
                  onClick={() => setSelectedTier('broadcast')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedTier === 'broadcast'
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-white font-bold'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <p className="text-[10px] uppercase font-mono text-emerald-400">Broadcast / AAA</p>
                  <p className="text-sm font-mono font-bold text-white">
                    ${checkoutTrack.pricing.broadcast.toLocaleString()}
                  </p>
                </button>
              </div>

              {/* Licensee & Project details input */}
              <div className="space-y-3 pt-2">
                <div>
                  <label htmlFor="modalProjectTitleInput" className="block text-xs font-mono text-zinc-400 mb-1">
                    Your Video Game, Film, or Commercial Project Title *
                  </label>
                  <input
                    id="modalProjectTitleInput"
                    type="text"
                    required
                    value={projectTitleInput}
                    onChange={(e) => setProjectTitleInput(e.target.value)}
                    placeholder="e.g. Cybernetic Overdrive — Launch Trailer"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label htmlFor="modalLicenseeNameInput" className="block text-xs font-mono text-zinc-400 mb-1">
                    Licensee Organization / Producer Name
                  </label>
                  <input
                    id="modalLicenseeNameInput"
                    type="text"
                    value={licenseeNameInput}
                    onChange={(e) => setLicenseeNameInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Smart Contract Split Preview */}
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-2">
                <p className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider">
                  Programmatic Royalty Distribution (Zero Trust Execution):
                </p>
                <div className="space-y-1">
                  {checkoutTrack.splits.map((s, idx) => {
                    const price =
                      selectedTier === 'indie'
                        ? checkoutTrack.pricing.indie
                        : selectedTier === 'commercial'
                        ? checkoutTrack.pricing.commercial
                        : checkoutTrack.pricing.broadcast;
                    const amount = ((price * s.percentage) / 100).toFixed(2);
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs font-mono">
                        <span className="text-zinc-300">
                          {s.name} <span className="text-zinc-500">({s.role} • {s.percentage}%)</span>
                        </span>
                        <span className="text-emerald-400 font-bold">${amount} USD</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
              <Button
                variant="outline"
                onClick={() => setCheckoutTrack(null)}
                className="border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExecuteSyncLicense}
                disabled={!projectTitleInput || isProcessing}
                className="bg-gradient-to-r from-cyan-500 to-violet-500 hover:brightness-110 text-white font-bold px-6 rounded-xl shadow-lg shadow-cyan-950/50"
              >
                {isProcessing ? 'Executing Smart Contract...' : 'Execute Sync License & Download Certificate'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL SYNC LICENSE CERTIFICATE INSPECTOR MODAL */}
      {activeCertificateModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border-2 border-cyan-500/60 rounded-3xl max-w-2xl w-full p-6 sm:p-10 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider font-mono">
                    Official Sync License Certificate
                  </h3>
                  <p className="text-xs font-mono text-cyan-400">
                    Certificate ID: {activeCertificateModal.certificateId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveCertificateModal(null)}
                className="text-zinc-500 hover:text-white text-sm font-mono"
              >
                [Close]
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-zinc-900/90 border border-zinc-800 space-y-4 font-mono text-xs text-zinc-300">
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>LICENSEE:</span>
                <strong className="text-white text-sm">{activeCertificateModal.licenseeName}</strong>
              </div>
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>PROJECT TITLE:</span>
                <strong className="text-cyan-300 text-sm">{activeCertificateModal.projectTitle}</strong>
              </div>
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>MASTER TRACK:</span>
                <strong className="text-white">{activeCertificateModal.trackTitle} ({activeCertificateModal.artist})</strong>
              </div>
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>SYNC RIGHTS TIER:</span>
                <strong className="text-emerald-400">{activeCertificateModal.tier}</strong>
              </div>
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>TERRITORY &amp; TERM:</span>
                <strong className="text-white">Worldwide / In Perpetuity (Master &amp; Publishing Included)</strong>
              </div>
              <div className="border-b border-zinc-800 pb-3 flex items-center justify-between">
                <span>TOTAL LICENSE FEE:</span>
                <strong className="text-white font-bold text-sm">
                  ${activeCertificateModal.amountPaid.toLocaleString()} USD
                </strong>
              </div>

              <div className="pt-2">
                <p className="text-[10px] text-zinc-500 uppercase mb-1">
                  SHA-256 / On-Chain Transaction Hash:
                </p>
                <p className="text-cyan-400/90 break-all bg-black/60 p-2 rounded-lg border border-zinc-800">
                  {activeCertificateModal.txHash}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Cryptographically Signed by Sovranly IP
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `Sync License Certificate ${activeCertificateModal.certificateId}\nTrack: ${activeCertificateModal.trackTitle}\nTx: ${activeCertificateModal.txHash}`
                    );
                    alert('Certificate summary copied to clipboard!');
                  }}
                  className="border-zinc-800 bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-mono"
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Hash
                </Button>
                <Button
                  onClick={() => setActiveCertificateModal(null)}
                  className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white text-xs font-mono font-bold"
                >
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
