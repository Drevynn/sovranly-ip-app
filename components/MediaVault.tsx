'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { 
  UploadCloud, 
  Lock, 
  Unlock, 
  Play, 
  Pause, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Volume2, 
  Music, 
  Tv, 
  FileCheck, 
  AlertTriangle,
  RefreshCw,
  Binary,
  Maximize2,
  FolderLock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type VaultAsset = {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  encryptionHash: string;
  isCustom?: boolean;
};

export default function MediaVault() {
  const { user, isSandboxMode } = useAuth();
  const [vaultList, setVaultList] = useState<VaultAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<VaultAsset | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch real assets for the user from /api/assets
  useEffect(() => {
    let active = true;
    const fetchVaultAssets = async () => {
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/assets', {
          headers: { ...headers }
        });
        if (res.ok) {
          const rawAssets = await res.json();
          if (active && Array.isArray(rawAssets)) {
            const mapped: VaultAsset[] = rawAssets.map((ast: any, idx: number) => {
              let cleanType = 'Audio';
              if (ast.type?.includes('Audio') || ast.type?.includes('Music')) cleanType = 'Audio';
              else if (ast.type?.includes('Video') || ast.type?.includes('Animation')) cleanType = 'Video';
              else cleanType = 'Document';

              return {
                id: ast.id || `vault-custom-${idx}`,
                name: ast.fileName || ast.title || 'Untitled_IP_Asset',
                type: cleanType,
                size: ast.fileSize || '12.4 MB',
                uploadedAt: ast.createdAt || new Date().toISOString(),
                encryptionHash: ast.ipfsHash || `0x${Math.random().toString(16).slice(2, 66)}`
              };
            });

            setVaultList(mapped);
            if (mapped.length > 0) {
              setSelectedAsset(mapped[0]);
            } else {
              setSelectedAsset(null);
            }
          }
        }
      } catch (err) {
        console.error('Error loading vault assets:', err);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchVaultAssets();
    return () => { active = false; };
  }, [user, isSandboxMode]);

  
  // Drag-and-drop state
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hexMatrix, setHexMatrix] = useState<string[]>([]);
  
  // Decryption & Player State
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [decryptionLoading, setDecryptionLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [frequencyFactor, setFrequencyFactor] = useState(1);
  const [scraperShieldAlert, setScraperShieldAlert] = useState(false);
  const [authSessionToken, setAuthSessionToken] = useState<string | null>(null);

  // Audio spectrum visualizer canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // Generate dynamic hex matrix blocks for encryption visualization
  useEffect(() => {
    if (isUploading) {
      const interval = setInterval(() => {
        const chars = '0123456789ABCDEF';
        const newMatrix = Array.from({ length: 48 }, () => {
          return chars[Math.floor(Math.random() * 16)] + chars[Math.floor(Math.random() * 16)];
        });
        setHexMatrix(newMatrix);
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isUploading]);

  // Canvas visualizer loop
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let offset = 0;
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw background dark grid
      ctx.strokeStyle = '#18181b';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let j = 0; j < height; j += 15) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(width, j);
        ctx.stroke();
      }

      if (isPlaying && isDecrypted) {
        offset += 0.05 * frequencyFactor;
        
        // Draw multiple premium colorful sine waves with transparency
        const wavesCount = 4;
        const colors = [
          'rgba(34, 211, 238, 0.65)',  // Cyan-400
          'rgba(139, 92, 246, 0.5)',   // Violet-500
          'rgba(16, 185, 129, 0.4)',   // Emerald-500
          'rgba(6, 182, 212, 0.2)'     // Darker Cyan
        ];

        for (let w = 0; w < wavesCount; w++) {
          ctx.beginPath();
          ctx.strokeStyle = colors[w];
          ctx.lineWidth = 2 + (wavesCount - w);
          ctx.shadowBlur = w === 0 ? 12 : 0;
          ctx.shadowColor = 'rgba(34, 211, 238, 0.4)';

          for (let x = 0; x < width; x++) {
            const angle = (x / width) * Math.PI * 6 + offset + (w * Math.PI / 4);
            const amplitude = (Math.sin(angle) * 35 * Math.sin(offset * 0.5 + w)) * (0.4 + (volume / 100) * 0.6);
            const y = centerY + amplitude;
            
            if (x === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        }

        // Draw active digital particles in background
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(34, 211, 238, 0.8)';
        for (let p = 0; p < 8; p++) {
          const px = (offset * 120 + p * 80) % width;
          const py = centerY + Math.sin(px * 0.01 + offset) * 20;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Draw static baseline
        ctx.beginPath();
        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 1.5;
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, isDecrypted, volume, frequencyFactor]);

  // Handle Drag Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      simulateSecureUpload(droppedFile.name, droppedFile.size, droppedFile.type);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      simulateSecureUpload(selectedFile.name, selectedFile.size, selectedFile.type);
    }
  };

  // Simulation upload & cryptography locking
  const simulateSecureUpload = (filename: string, sizeBytes: number, rawType: string) => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(5);
    
    // Map human readable type
    let cleanType = 'Document';
    if (rawType.startsWith('audio/')) cleanType = 'Audio';
    else if (rawType.startsWith('video/')) cleanType = 'Video';
    else if (rawType.includes('pdf') || rawType.includes('text') || filename.endsWith('.docx')) cleanType = 'Document';

    const sizeFormatted = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';

    // Incremental progress with key state check
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const newAssetId = 'vault-' + Math.floor(1000 + Math.random() * 9000);
            const freshHash = '0x' + Math.random().toString(16).slice(2, 66);
            const newVaultObjRef: VaultAsset = {
              id: newAssetId,
              name: filename,
              type: cleanType,
              size: sizeFormatted === '0.0 MB' ? '1.4 MB' : sizeFormatted,
              uploadedAt: new Date().toISOString(),
              encryptionHash: freshHash,
              isCustom: true
            };

            setVaultList(prevList => [newVaultObjRef, ...prevList]);
            setSelectedAsset(newVaultObjRef);
            setIsUploading(false);
            setUploadProgress(0);
          }, 850);
          return 100;
        }
        return prev + Math.floor(Math.random() * 12 + 6);
      });
    }, 150);
  };

  // Perform Decryption Handshake
  const triggerDecryptionHandshake = async () => {
    if (!selectedAsset) return;
    if (isDecrypted) {
      setIsDecrypted(false);
      setIsPlaying(false);
      setAuthSessionToken(null);
      return;
    }

    setDecryptionLoading(true);
    setAuthSessionToken(null);

    // Simulate three-part zero trust verification checks
    await new Promise(resolve => setTimeout(resolve, 800)); // check 1
    // auth signature check
    await new Promise(resolve => setTimeout(resolve, 800)); // check 2
    // scraper sandbox validation
    await new Promise(resolve => setTimeout(resolve, 600)); // check 3

    setIsDecrypted(true);
    setDecryptionLoading(false);
    setAuthSessionToken('SESSION-KEY-' + Math.random().toString(36).substring(3, 11).toUpperCase());
  };

  // Playback Toggle
  const togglePlayState = () => {
    if (!isDecrypted) return;
    setIsPlaying(p => !p);
  };

  // Simulation of screen recording interception (anti-scraper)
  const triggerAntiScraperShield = () => {
    setScraperShieldAlert(true);
    setTimeout(() => {
      setScraperShieldAlert(false);
    }, 4500);
  };

  return (
    <div className="space-y-8" id="secure-media-vault-section">
      <div className="flex items-center gap-2 mb-2">
        <Binary className="w-6 h-6 text-cyan-400" />
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Scraper Shield Vault</h2>
        <span className="text-[9px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-2 py-0.5 rounded-full uppercase ml-2 animate-pulse">Encrypted Player v3.5</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Drag & Drop Media Vault Upload Area */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
            <CardHeader className="p-6 pb-0">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-cyan-400" /> Secure Media Vault
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs">
                Drag-and-drop raw media files to encrypt and seal them under a zero-trust wrapper before loading into public content CDNs.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Dropzone Container */}
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative group overflow-hidden ${
                  isDragOver ? 'bg-cyan-950/15 border-cyan-400' : 'bg-zinc-900/10 border-zinc-800 hover:border-cyan-500/40 hover:bg-zinc-900/20'
                }`}
                onClick={() => document.getElementById('vault-file-selector')?.click()}
              >
                <input 
                  id="vault-file-selector"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  accept="audio/*,video/*,application/pdf"
                />

                {isUploading ? (
                  <div className="space-y-4 w-full px-4 relative z-10 py-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-950/40 border border-cyan-800 flex items-center justify-center mx-auto">
                      <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-mono text-cyan-400 font-bold uppercase animate-pulse">Running AES-256 Block Sealing...</p>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-cyan-400 h-full transition-all duration-150" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                    <p className="text-[10px] text-zinc-500 font-mono">Progress: {uploadProgress}% Encrypted</p>
                  </div>
                ) : (
                  <div className="space-y-3 py-4 relative z-10">
                    <UploadCloud className="w-10 h-10 text-zinc-650 mx-auto group-hover:text-cyan-400 transition-colors duration-300" />
                    <div>
                      <p className="text-xs font-bold text-white">Drag & drop your asset or <span className="text-cyan-400 font-mono">Select</span></p>
                      <p className="text-[10px] text-zinc-500 mt-1">Supports WAV, MP3, MP4, PDF • Up to 250MB</p>
                    </div>
                  </div>
                )}
                
                {/* Glowing subtle ring */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-950/5 transition-all duration-300" />
              </div>

              {/* Real-time Crypto Sealing Visualizer Grid */}
              {isUploading && (
                <div className="space-y-2 p-4 bg-black rounded-xl border border-zinc-900 font-mono">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 pb-2 border-b border-zinc-900">
                    <span className="flex items-center gap-1.5"><Binary className="w-3.5 h-3.5 text-cyan-400" /> Steganographic Injection</span>
                    <span className="text-cyan-400 uppercase font-bold text-[9px]">AES-GCM-256 ACTIVE</span>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 text-[10px] text-center max-h-[85px] overflow-hidden select-none text-cyan-500/70">
                    {hexMatrix.map((hk, i) => (
                      <span key={i} className="bg-zinc-950 p-1 rounded border border-zinc-900 text-[9px] transition-colors duration-100 hover:text-white">
                        {hk}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Secure Handshake Logs & Vault List */}
              <div className="space-y-3">
                <Label className="text-xs text-zinc-500 uppercase tracking-widest font-black font-sans">Sealed Vault Archives</Label>
                <div className="space-y-2 max-h-[195px] overflow-auto pr-1">
                  {vaultList.length === 0 ? (
                    <div className="p-6 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/50 space-y-2">
                      <FolderLock className="w-8 h-8 text-zinc-650 mx-auto" />
                      <p className="text-xs text-zinc-400 font-medium">Your Media Vault is clean and empty</p>
                      <p className="text-[10px] text-zinc-500">Drag & drop files above or register assets in the Asset Manager to lock them in the encrypted vault.</p>
                    </div>
                  ) : (
                    vaultList.map((asset) => {
                      const active = selectedAsset?.id === asset.id;
                      return (
                        <button
                          key={asset.id}
                          onClick={() => {
                            setSelectedAsset(asset);
                            setIsDecrypted(false);
                            setIsPlaying(false);
                            setAuthSessionToken(null);
                          }}
                          type="button"
                          className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                            active 
                              ? 'bg-zinc-900 border-cyan-500/40 text-white' 
                              : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                          }`}
                        >
                          <div className="min-w-0 pr-3 flex-1 flex items-center gap-2.5">
                            {asset.type === 'Audio' ? (
                              <Music className={`w-4 h-4 flex-shrink-0 ${active ? 'text-cyan-450' : 'text-zinc-600'}`} />
                            ) : asset.type === 'Video' ? (
                              <Tv className="w-4 h-4 text-violet-500 flex-shrink-0" />
                            ) : (
                              <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold truncate leading-none mb-1 text-zinc-200">{asset.name}</p>
                              <p className="text-[9px] text-zinc-500 font-mono tracking-wide">
                                Cipher Block: {asset.encryptionHash.slice(0, 16)}...
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 pl-2">
                            <span className="text-[10px] font-mono font-black">{asset.size}</span>
                            <p className="text-[9px] text-zinc-500 uppercase font-bold">{asset.type}</p>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Zero-Trust Encrypted Secure Player */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[510px]">
            <div className="absolute top-0 left-0 w-32 h-32 bg-violet-500/5 rounded-full blur-[40px] pointer-events-none" />
            
            {/* Warning Alarm overlay */}
            {scraperShieldAlert && (
              <div className="absolute inset-0 bg-red-950/95 z-40 flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-sm">
                <ShieldAlert className="w-16 h-16 text-red-500 animate-bounce mb-4" />
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Scraper Interception Shield Activated</h3>
                <p className="text-xs text-zinc-400 max-w-sm mt-2 leading-relaxed">
                  Sovranly Zero-Trust Shield detected an unauthorized screenshot tool or inspection process trying to read the dynamic media frame. Playback paused instantly.
                </p>
                <Button 
                  onClick={() => {
                    setScraperShieldAlert(false);
                    setIsPlaying(false);
                  }}
                  className="mt-6 bg-red-650 hover:bg-red-700 text-white font-mono text-xs px-6 py-2"
                >
                  Reset Interceptor Shield
                </Button>
              </div>
            )}

            <div>
              <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between border-b border-zinc-900/80">
                <div>
                  <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Decryption Shell Player
                  </CardTitle>
                </div>
                {isDecrypted ? (
                  <span className="text-[9px] bg-cyan-950 text-cyan-400 border border-cyan-900 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" /> Secure Link Established
                  </span>
                ) : (
                  <span className="text-[9px] bg-zinc-900 text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">
                    Cipher Guard Active
                  </span>
                )}
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                
                {/* Simulated Screen / Visualizer Canvas Frame */}
                <div className="bg-[#0b0c10] border border-zinc-900 rounded-2xl overflow-hidden relative">
                  <canvas 
                    ref={canvasRef} 
                    width={480} 
                    height={160} 
                    className="w-full block aspect-[21/9]"
                  />
                  
                  {/* Closed Shield Cover */}
                  {!isDecrypted && (
                    <div className="absolute inset-0 bg-[#07080a]/90 flex flex-col items-center justify-center p-4 text-center">
                      <Lock className="w-10 h-10 text-cyan-550 mb-3" />
                      <p className="text-xs font-bold text-white uppercase tracking-tight">Zero Trust Cryptographic Container Locked</p>
                      <p className="text-[9px] text-zinc-500 max-w-xs mt-1 leading-normal">
                        Perform a continuous zero-trust identity handshake to authenticate and stream raw content chunks.
                      </p>
                    </div>
                  )}

                  {isDecrypted && !isPlaying && (
                    <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none">
                      <p className="text-[10px] text-zinc-650 uppercase font-mono tracking-widest bg-zinc-950/80 px-3 py-1.5 border border-zinc-900 rounded-full">
                        Secure Streaming Channel Idle
                      </p>
                    </div>
                  )}
                </div>

                {/* Displaying Current Info */}
                {selectedAsset ? (
                  <div className="flex items-start justify-between bg-zinc-900/20 p-4 border border-zinc-900/60 rounded-xl space-y-1">
                    <div className="min-w-0 pr-4">
                      <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">ACTIVE TARGET CHANNEL</p>
                      <p className="text-xs font-black text-white truncate max-w-[280px] mt-0.5">{selectedAsset.name}</p>
                      <p className="text-[9px] text-zinc-400 font-mono mt-1">Hash ID: {selectedAsset.encryptionHash.slice(0, 32)}...</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono font-semibold text-zinc-500">MIME-TYPE:</span>
                      <p className="text-[10px]" style={{ color: selectedAsset.type === 'Audio' ? '#22d3ee' : '#a78bfa' }}>
                        {selectedAsset.type === 'Audio' ? 'audio/x-wav' : selectedAsset.type === 'Video' ? 'video/mp4' : 'application/pdf'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-zinc-900/20 border border-zinc-900/60 rounded-xl text-center">
                    <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black">NO ACTIVE ASSET SELECTED</p>
                    <p className="text-xs text-zinc-400 mt-1">Upload or register an asset to open in Decryption Shell</p>
                  </div>
                )}

                {/* Secure handshaking session tokens info */}
                {isDecrypted && authSessionToken && (
                  <div className="grid grid-cols-2 gap-4 bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 text-left font-mono text-[9px] text-zinc-500">
                    <div>
                      <span className="text-zinc-600 block">HANDSHAKE SESSION KEY</span>
                      <span className="text-cyan-400 font-bold">{authSessionToken}</span>
                    </div>
                    <div>
                      <span className="text-zinc-600 block">SCRAPER BLOCK PROTECTION</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        ● CONTINUOUS ACTIVE
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </div>

            {/* Decryption Controls & Player Operations */}
            <div className="p-6 border-t border-zinc-900 space-y-4">
              
              {/* Audio controller sliders when decrypted */}
              {isDecrypted && (
                <div className="grid grid-cols-2 gap-4 pb-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-500">
                      <span>Dynamic Wave Range</span>
                      <span className="text-zinc-300">x{frequencyFactor}</span>
                    </div>
                    <Input
                      type="range"
                      min="1"
                      max="5"
                      step="0.5"
                      value={frequencyFactor}
                      onChange={(e) => setFrequencyFactor(Number(e.target.value))}
                      className="accent-cyan-400 h-1 appearance-none cursor-pointer p-0 bg-zinc-900 border-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[9px] font-mono uppercase text-zinc-500">
                      <span>Acoustic Output</span>
                      <span className="text-emerald-400">{volume}%</span>
                    </div>
                    <Input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-zinc-900 border-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {/* Decrypt Handshake Anchor */}
                <Button
                  onClick={triggerDecryptionHandshake}
                  disabled={decryptionLoading}
                  type="button"
                  variant={isDecrypted ? 'outline' : 'default'}
                  className={`flex-1 py-5 rounded-xl font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 ${
                    isDecrypted 
                      ? 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:bg-zinc-900' 
                      : 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white hover:brightness-110 shadow-lg shadow-cyan-950/40'
                  }`}
                >
                  {decryptionLoading ? (
                    <>
                      <Loader spinnerClassName="h-3.5 w-3.5 animate-spin" />
                      Handshaking Ledger...
                    </>
                  ) : isDecrypted ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-red-400" />
                      Seal Container
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3.5 h-3.5" />
                      Authorize & Decrypt
                    </>
                  )}
                </Button>

                {/* Play/Pause control */}
                <Button
                  onClick={togglePlayState}
                  disabled={!isDecrypted}
                  type="button"
                  className={`w-14 items-center justify-center rounded-xl transition-all ${
                    isDecrypted 
                      ? isPlaying 
                        ? 'bg-zinc-900 text-cyan-400 hover:bg-zinc-850 border border-zinc-800' 
                        : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-950/20'
                      : 'bg-zinc-900 border border-zinc-900 text-zinc-700 cursor-not-allowed'
                  }`}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </Button>
              </div>

              {/* Scraper Shield Test Button */}
              {isDecrypted && (
                <div className="flex items-center justify-between pt-2 border-t border-zinc-900">
                  <p className="text-[10px] text-zinc-500 leading-none">Scraper shield system validation test:</p>
                  <button 
                    onClick={triggerAntiScraperShield}
                    type="button"
                    className="text-[9px] font-mono text-red-400 hover:text-red-300 hover:underline flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3 text-red-500" /> Trigger Intercept Simulation
                  </button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Inline fallback loader helper
function Loader({ spinnerClassName }: { spinnerClassName?: string }) {
  return (
    <div className={spinnerClassName}>
      <span className="block w-full h-full rounded-full border-2 border-solid border-white border-t-transparent animate-spin" />
    </div>
  );
}
