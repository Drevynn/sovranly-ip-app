'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/FirebaseProvider';
import { getAuthHeaders } from '@/lib/auth-client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Presentation, 
  Sparkles, 
  Plus, 
  Check, 
  Loader2, 
  Play, 
  FileText, 
  ArrowRight, 
  ExternalLink, 
  Link2, 
  ShieldCheck, 
  HardDrive, 
  RefreshCw, 
  Layers, 
  Sliders, 
  Layout, 
  Image as ImageIcon, 
  Send,
  Eye,
  AlertCircle,
  Clock,
  Code,
  Music,
  User,
  Shield,
  HelpCircle,
  Copy,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { motion, AnimatePresence } from 'motion/react';

export type Asset = { 
  id: string; 
  title: string; 
  type: string; 
  royalty: number; 
  license: string; 
  description?: string;
  ownerAddress?: string;
  isMinted?: boolean;
  nftTokenId?: string | null;
  mintTxHash?: string | null;
  price?: number | null;
  isForSale?: boolean;
  createdAt?: string;
  ipfsHash?: string | null;
};

type DrivePresentation = {
  id: string;
  name: string;
  webViewLink?: string;
  modifiedTime?: string;
};

// Simulated slides for Sandbox preview mode
const GET_SIMULATED_SLIDES = (asset: Asset) => [
  {
    title: asset.title,
    subtitle: "SOVEREIGN IP INVESTMENT PROPOSAL",
    meta: "SECURED VIA SOVRANLY IP PROTOCOL • CLASS-42 REGISTRY",
    content: [
      { label: "IP OWNER ADDRESS", value: asset.ownerAddress || "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
      { label: "REGISTRATION NODE", value: "SVIP-MAINNET-CORE-1" },
      { label: "PROTOCOL STATUS", value: "VERIFIED & ACTIVE", accent: true }
    ],
    bgGradient: "from-cyan-950/40 via-zinc-950 to-zinc-950"
  },
  {
    title: "IP SPECIFICATIONS",
    subtitle: "AUTHENTICATED ASSET OVERVIEW & TYPE",
    meta: "METADATA SYNCHRONIZATION GUARANTEE",
    content: [
      { label: "ASSET IDENTIFIER", value: asset.id || "PRESET-ASSET-ID" },
      { label: "ASSET CLASSIFICATION", value: asset.type },
      { label: "IP DESCRIPTION", value: asset.description || "No description loaded for this asset." },
      { label: "IPFS CONTENT ADDRESS (CID)", value: asset.ipfsHash || "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" }
    ],
    bgGradient: "from-violet-950/40 via-zinc-950 to-zinc-950"
  },
  {
    title: "LICENSING & ROYALTIES",
    subtitle: "SMART-CONTRACT EXECUTABLE TERMS",
    meta: "ATOMIC P2P SPLIT SCHEDULERS",
    content: [
      { label: "ROYALTY FRACTION RETAINED", value: `${asset.royalty}% to Author / Creator` },
      { label: "LICENSURE FRAMEWORK", value: asset.license },
      { label: "ESCROW CONSTRAINTS", value: "Atomic split on-receipt via smart contracts" },
      { label: "PRICING", value: asset.price ? `${asset.price} ETH` : "Custom Negotiable Fee" }
    ],
    bgGradient: "from-emerald-950/40 via-zinc-950 to-zinc-950"
  },
  {
    title: "DECENTRALIZED PROOF",
    subtitle: "BLOCKCHAIN REGISTRY & TIMESTAMPS",
    meta: "IMPERISHABLE EVIDENCE RECORD",
    content: [
      { label: "MINTING STATUS", value: asset.isMinted ? "MINTED ON ETHEREUM L2" : "REGISTRATION QUEUED" },
      { label: "NFT TOKEN ID", value: asset.nftTokenId || "SVIP-PENDING-SIGNATURE" },
      { label: "TRANSACTION RECORD", value: asset.mintTxHash || "0x4bca3e52fef49b062c199efa454eb8d92ca847242" },
      { label: "REGISTRY STAMP", value: asset.createdAt || new Date().toISOString() }
    ],
    bgGradient: "from-amber-950/40 via-zinc-950 to-zinc-950"
  }
];

export default function GoogleSlidesManager() {
  const { user, isSandboxMode, accessToken, signInWithGoogle } = useAuth();
  const { t, language } = useLanguage();

  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [presentations, setPresentations] = useState<DrivePresentation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [loadingDrive, setLoadingDrive] = useState(false);
  
  // Slide generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [genLogs, setGenLogs] = useState<string[]>([]);
  const [selectedPresentationId, setSelectedPresentationId] = useState<string | null>(null);
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  
  // Simulated Slides variables for preview
  const [activeSimulatedSlide, setActiveSimulatedSlide] = useState(0);
  const [showSimulatedSlideDeck, setShowSimulatedSlideDeck] = useState(false);

  // Load assets from our API
  useEffect(() => {
    let isMounted = true;
    const fetchAssets = async () => {
      setLoadingAssets(true);
      try {
        const headers = await getAuthHeaders(user, isSandboxMode);
        const res = await fetch('/api/assets', {
          headers: {
            ...headers
          }
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (isMounted) {
          setAssets(data);
          if (data.length > 0) {
            setSelectedAsset(data[0]);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        if (isMounted) setLoadingAssets(false);
      }
    };
    fetchAssets();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch slide decks from Google Drive once accessToken is loaded
  const fetchDrivePresentations = async () => {
    if (!accessToken || accessToken === 'sandbox-token-123') return;
    setLoadingDrive(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.presentation'&fields=files(id,name,webViewLink,modifiedTime)&pageSize=12&orderBy=modifiedTime desc`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!res.ok) throw new Error('Drive fetch failed');
      const data = await res.json();
      if (data.files) {
        setPresentations(data.files);
      }
    } catch (err) {
      console.error('Error fetching Google Slides from Drive:', err);
    } finally {
      setLoadingDrive(false);
    }
  };

  useEffect(() => {
    if (accessToken && accessToken !== 'sandbox-token-123') {
      fetchDrivePresentations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Perform compilation / creation of slides on Google Drive or Simulation
  const handleCompileSlideDeck = async () => {
    if (!selectedAsset) return;

    // Sandbox check or no valid Google token
    if (isSandboxMode || !accessToken || accessToken === 'sandbox-token-123') {
      runSimulatedGeneration();
      return;
    }

    setIsGenerating(true);
    setGeneratedId(null);
    setGenLogs([
      `[AUTHENTICATING] Continuous Session Verification Validated.`,
      `[INITIALIZATION] Instantiating Google Slides Node.`,
      `[POST /v1/presentations] Requesting blank presentation deck...`
    ]);

    try {
      // 1. Create Blank Presentation with Name
      const createRes = await fetch('https://slides.googleapis.com/v1/presentations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          title: `${selectedAsset.title} - Sovereign IP Pitch Deck`,
        }),
      });

      if (!createRes.ok) throw new Error(`Google API instantiation failed: ${createRes.statusText}`);
      const presentation = await createRes.json();
      const presentationId = presentation.presentationId;
      
      setGenLogs(prev => [
        ...prev,
        `[SUCCESS] Google Slides Deck created with ID: ${presentationId}`,
        `[PUT ${presentationId}:batchUpdate] Preparing structured batch updates (4 custom slides)...`
      ]);

      // 2. We will compile 4 custom styled slides.
      // We will add 3 slides first, then create layout shapes (textboxes, backgrounds, lines) for slide 1, 2, 3, 4.
      // In Google Slides, the default deck comes with exactly one cover slide (index 0).
      // We can add 3 slides of layout "BLANK" first.
      const slide2Id = "slide_specs_id_001";
      const slide3Id = "slide_security_id_002";
      const slide4Id = "slide_royalty_id_003";

      const addSlidesPayload = {
        requests: [
          {
            createSlide: {
              objectId: slide2Id,
              insertionIndex: 1,
              slideLayoutReference: { predefinedLayout: 'BLANK' }
            }
          },
          {
            createSlide: {
              objectId: slide3Id,
              insertionIndex: 2,
              slideLayoutReference: { predefinedLayout: 'BLANK' }
            }
          },
          {
            createSlide: {
              objectId: slide4Id,
              insertionIndex: 3,
              slideLayoutReference: { predefinedLayout: 'BLANK' }
            }
          }
        ]
      };

      setGenLogs(prev => [...prev, `[INFO] Requesting slide appends...`]);

      const addSlidesRes = await fetch(`https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(addSlidesPayload)
      });

      if (!addSlidesRes.ok) throw new Error(`Google API append slide failed: ${addSlidesRes.statusText}`);
      
      setGenLogs(prev => [
        ...prev,
        `[SUCCESS] Slide frames injected. Inscribing asset content & Zero Trust metadata...`
      ]);

      // 3. Now let's populate textboxes into slide 1 (the default created slide), slide 2, slide 3, slide 4.
      // Slide 1 has a default ID (we can fetch it, or we can just populate our created blank slides with text!).
      // To keep things super bulletproof, let's create shapes & text in slide 2, slide 3, and slide 4!
      
      // We create a title text box and a body text box on Slide 2 (Specs)
      const populatePayload = {
        requests: [
          // Slide 2: Specs title
          {
            createShape: {
              objectId: "slide2_title",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide2Id,
                size: {
                  width: { magnitude: 6000000, unit: "EMU" },
                  height: { magnitude: 1000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide2_title",
              text: "IP SPECIFICATIONS & SPECIFICS\n"
            }
          },
          {
            updateTextStyle: {
              objectId: "slide2_title",
              style: {
                bold: true,
                fontSize: { magnitude: 26, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.1, green: 0.7, blue: 0.9 } } },
                fontFamily: "Trebuchet MS"
              },
              textRange: { type: "ALL" }
            }
          },
          // Slide 2: Specs body description
          {
            createShape: {
              objectId: "slide2_body",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide2Id,
                size: {
                  width: { magnitude: 8000000, unit: "EMU" },
                  height: { magnitude: 4000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 1500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide2_body",
              text: `Asset Title: ${selectedAsset.title}\n\nAsset Type: ${selectedAsset.type}\n\nDescription: ${selectedAsset.description || 'No description supplied.'}\n\nIPFS CID Hash:\n${selectedAsset.ipfsHash || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'}\n\nRegistered via Sovranly Zero Trust IP Registry Node.\n`
            }
          },
          {
            updateTextStyle: {
              objectId: "slide2_body",
              style: {
                fontSize: { magnitude: 14, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.8, green: 0.8, blue: 0.8 } } },
                fontFamily: "Arial"
              },
              textRange: { type: "ALL" }
            }
          },

          // Slide 3: Security & Blockchain Registry
          {
            createShape: {
              objectId: "slide3_title",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide3Id,
                size: {
                  width: { magnitude: 6000000, unit: "EMU" },
                  height: { magnitude: 1000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide3_title",
              text: "ON-CHAIN REGISTRY DEPLOYMENT\n"
            }
          },
          {
            updateTextStyle: {
              objectId: "slide3_title",
              style: {
                bold: true,
                fontSize: { magnitude: 26, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.6, green: 0.4, blue: 0.9 } } },
                fontFamily: "Trebuchet MS"
              },
              textRange: { type: "ALL" }
            }
          },
          // Slide 3: Security details
          {
            createShape: {
              objectId: "slide3_body",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide3Id,
                size: {
                  width: { magnitude: 8000000, unit: "EMU" },
                  height: { magnitude: 4000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 1500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide3_body",
              text: `Status: ${selectedAsset.isMinted ? 'Minted on Ethereum Layer-2 (Mainnet Securitas)' : 'Queued for Cryptographic Inscription'}\n\nNFT Token Identifier: ${selectedAsset.nftTokenId || 'SVIP-VERIFICATION-PENDING'}\n\nRegistration Hash:\n${selectedAsset.mintTxHash || '0x4bca3e52fef49b062c199efa454eb8d92ca847242'}\n\nTimestamp Registered: ${selectedAsset.createdAt || new Date().toISOString()}\n\nAuthorized Agent Root: ${selectedAsset.ownerAddress || '0x742d35Cc6634C0532925a3b844Bc454e4438f44e'}\n`
            }
          },
          {
            updateTextStyle: {
              objectId: "slide3_body",
              style: {
                fontSize: { magnitude: 14, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.8, green: 0.8, blue: 0.8 } } },
                fontFamily: "Arial"
              },
              textRange: { type: "ALL" }
            }
          },

          // Slide 4: Licensing terms and fractions
          {
            createShape: {
              objectId: "slide4_title",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide4Id,
                size: {
                  width: { magnitude: 6000000, unit: "EMU" },
                  height: { magnitude: 1000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide4_title",
              text: "ROYALTY COMPACTS & LICENSING\n"
            }
          },
          {
            updateTextStyle: {
              objectId: "slide4_title",
              style: {
                bold: true,
                fontSize: { magnitude: 26, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.1, green: 0.8, blue: 0.4 } } },
                fontFamily: "Trebuchet MS"
              },
              textRange: { type: "ALL" }
            }
          },
          // Slide 4: Licensing body
          {
            createShape: {
              objectId: "slide4_body",
              shapeType: "TEXT_BOX",
              elementProperties: {
                pageObjectId: slide4Id,
                size: {
                  width: { magnitude: 8000000, unit: "EMU" },
                  height: { magnitude: 4000000, unit: "EMU" }
                },
                transform: {
                  scaleX: 1, scaleY: 1,
                  translateX: 500000, translateY: 1500000,
                  unit: "EMU"
                }
              }
            }
          },
          {
            insertText: {
              objectId: "slide4_body",
              text: `Royalty Allocation Retained: ${selectedAsset.royalty}% to Creator / Registrar\n\nLicensing Framework: ${selectedAsset.license}\n\nBase Commercial Royalty Price: ${selectedAsset.price ? `${selectedAsset.price} ETH` : 'Negotiable/Custom'}\n\nEscrow Terms: Autonomous disbursement on settlement. Protected under Sovereign Crypto-Legal framework.\n`
            }
          },
          {
            updateTextStyle: {
              objectId: "slide4_body",
              style: {
                fontSize: { magnitude: 14, unit: "PT" },
                foregroundColor: { opaqueColor: { rgbColor: { red: 0.8, green: 0.8, blue: 0.8 } } },
                fontFamily: "Arial"
              },
              textRange: { type: "ALL" }
            }
          }
        ]
      };

      const batchUpdateUrl = `https://slides.googleapis.com/v1/presentations/${presentationId}:batchUpdate`;

      const populateRes = await fetch(batchUpdateUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(populatePayload),
      });

      if (!populateRes.ok) throw new Error(`Google API slide write failed: ${populateRes.statusText}`);

      setGenLogs(prev => [
        ...prev,
        `[SUCCESS] 4-Slide Structured Presentation compiled flawlessly!`,
        `[SYNC] Syncing Google Drive to reflect changes...`
      ]);

      setGeneratedId(presentationId);
      setSelectedPresentationId(presentationId);
      setEmbedUrl(`https://docs.google.com/presentation/d/${presentationId}/embed?start=false&loop=false&delayms=3000`);

      // Refresh drive list
      await fetchDrivePresentations();

    } catch (err: any) {
      console.error(err);
      setGenLogs(prev => [...prev, `[CRITICAL ERROR] ${err.message || 'Unknown compilation failure'}`]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Run the sandbox simulation of generation
  const runSimulatedGeneration = () => {
    if (!selectedAsset) return;
    setIsGenerating(true);
    setGeneratedId(null);
    setGenLogs([
      `[SECURITY-CHECK] Iframe Context Sandbox detected. Redirecting to Sandbox Emulator Node.`,
      `[SIMULATOR-AUTH] Validating Sovereign Sandbox Token...`,
      `[POST /v1/presentations] Requesting mock deck template allocation...`
    ]);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setGenLogs(prev => [...prev, `[SUCCESS] Instantiated Simulated Deck with ID: mock-sovereign-deck-${selectedAsset.id}`]);
      } else if (step === 2) {
        setGenLogs(prev => [...prev, `[INFO] Compiling batch elements: 4 slides total (Cover, Specs, Security, Royalties)...`]);
      } else if (step === 3) {
        setGenLogs(prev => [...prev, `[INFO] Injecting JSON payload...`]);
        setGenLogs(prev => [...prev, `  - Inscribed Asset Title: "${selectedAsset.title}"`]);
        setGenLogs(prev => [...prev, `  - Inscribed Cryptographic IPFS proof: "${selectedAsset.ipfsHash || 'QmXoyp...3uco'}"`]);
      } else if (step === 4) {
        setGenLogs(prev => [
          ...prev, 
          `[SUCCESS] Layout structured, styled and finalized.`,
          `[PREVIEW-PREPARED] Local rendering model ready.`
        ]);
        setGeneratedId(`mock-sovereign-deck-${selectedAsset.id}`);
        setSelectedPresentationId(`mock-sovereign-deck-${selectedAsset.id}`);
        setShowSimulatedSlideDeck(true);
        setActiveSimulatedSlide(0);
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 1200);
  };

  const handleSelectPresentation = (id: string) => {
    setSelectedPresentationId(id);
    if (id.startsWith('mock-sovereign-deck-')) {
      setShowSimulatedSlideDeck(true);
      setActiveSimulatedSlide(0);
    } else {
      setShowSimulatedSlideDeck(false);
      setEmbedUrl(`https://docs.google.com/presentation/d/${id}/embed?start=false&loop=false&delayms=3000`);
    }
  };

  const activeAssetSlides = selectedAsset ? GET_SIMULATED_SLIDES(selectedAsset) : [];

  return (
    <div className="space-y-8 pb-16" id="google-slides-manager-container">
      {/* Header section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Presentation className="w-8 h-8 text-cyan-400" />
          <h2 className="text-3xl font-extrabold tracking-tighter text-white uppercase sm:text-4xl">
            Google Slides Gateway
          </h2>
        </div>
        <p className="text-zinc-400 text-sm max-w-2xl leading-relaxed">
          Compile, synchronize, and present cryptographically secure pitch decks of your intellectual property assets directly in Google Workspace, verified on the Sovranly protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Presentation Assembly & Control Center */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Section 1: Choose IP Asset */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
            <CardHeader className="p-0 pb-4 border-b border-zinc-900 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  01. Select Registered IP Asset
                </CardTitle>
                <p className="text-[10px] text-zinc-500">Pick the intellectual property asset to compile into a deck.</p>
              </div>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">
              {loadingAssets ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                </div>
              ) : assets.length === 0 ? (
                <div className="p-4 bg-zinc-900/40 border border-zinc-800/50 rounded-2xl text-center text-xs text-zinc-500 font-mono italic">
                  No assets found in registry. Please deploy an asset first.
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {assets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setSelectedAsset(asset);
                        // Reset simulation slide
                        setActiveSimulatedSlide(0);
                      }}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-start gap-3 cursor-pointer ${
                        selectedAsset?.id === asset.id
                          ? 'bg-zinc-900 border-cyan-500/40 shadow-md shadow-cyan-950/20'
                          : 'bg-zinc-900/20 border-zinc-900/60 hover:bg-zinc-900/40 hover:border-zinc-800'
                      }`}
                    >
                      {asset.type?.includes('Music') || asset.type?.includes('Audio') ? (
                        <div className="p-2 bg-cyan-950/40 rounded-xl border border-cyan-800/30 text-cyan-400">
                          <Music className="w-4 h-4" />
                        </div>
                      ) : asset.type?.includes('Artwork') || asset.type?.includes('Design') ? (
                        <div className="p-2 bg-purple-950/40 rounded-xl border border-purple-800/30 text-purple-400">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="p-2 bg-emerald-950/40 rounded-xl border border-emerald-800/30 text-emerald-400">
                          <FileText className="w-4 h-4" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-extrabold text-white truncate uppercase">{asset.title}</span>
                          <span className="text-[9px] font-mono font-bold px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-full">
                            {asset.royalty}%
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 truncate mb-1.5">{asset.description || 'No description supplied'}</p>
                        <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-mono">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{asset.isMinted ? 'VERIFIED ON-CHAIN' : 'LOCAL SIGNATURE'}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Assembly / Generator Control */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-violet-500/5 rounded-full blur-[40px] pointer-events-none" />
            <CardHeader className="p-0 pb-4 border-b border-zinc-900">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-violet-400" />
                02. Proposal Compiler
              </CardTitle>
              <p className="text-[10px] text-zinc-500">Inject registered metadata directly into formatted slides.</p>
            </CardHeader>
            <CardContent className="p-0 pt-4 space-y-4">
              {selectedAsset ? (
                <div className="space-y-4">
                  <div className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 text-xs space-y-2">
                    <div className="flex justify-between items-center text-[10px] uppercase font-mono text-zinc-500">
                      <span>Slide Content Queue</span>
                      <span className="text-cyan-400">4 Custom Slides</span>
                    </div>
                    <ul className="space-y-1 text-zinc-400 font-mono text-[10px]">
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Slide 1: Cover Proposal [{selectedAsset.title.slice(0, 20)}...]</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Slide 2: Technical Specifications & IPFS CID</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Slide 3: On-Chain Registry Record ({selectedAsset.isMinted ? 'Minted' : 'Pending'})</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-400" />
                        <span>Slide 4: Royalty allocations ({selectedAsset.royalty}%) & Licensure</span>
                      </li>
                    </ul>
                  </div>

                  {(!accessToken || accessToken === 'sandbox-token-123') && (
                    <div className="p-4 bg-amber-950/10 border border-amber-900/50 text-amber-400 text-xs rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                      <div className="space-y-1">
                        <p className="font-bold uppercase tracking-wider text-[11px]">Sandbox Mode Active</p>
                        <p className="text-[10px] leading-relaxed text-zinc-400">
                          Google Slides creation will run on our high-fidelity Sandbox compiler. To push slides to your real Google Drive account, connect your Google account below:
                        </p>
                        <Button 
                          onClick={signInWithGoogle}
                          className="mt-2 text-[10px] font-bold px-3 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Link2 className="w-3 h-3 text-cyan-400" /> Connect Google Account
                        </Button>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleCompileSlideDeck}
                    disabled={isGenerating}
                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-extrabold text-xs uppercase tracking-widest hover:brightness-110 shadow-lg shadow-cyan-950/30 transition-all flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Compiling Deck Node...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Compile Presentation Deck</span>
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-zinc-500 font-mono italic">
                  Select an asset above to initiate compilation.
                </div>
              )}

              {/* Transaction / Generation Logs */}
              {genLogs.length > 0 && (
                <div className="bg-black border border-zinc-900 rounded-2xl p-4 font-mono text-[9px] text-zinc-400 space-y-1.5 max-h-48 overflow-y-auto shadow-inner">
                  <div className="flex justify-between items-center text-zinc-600 uppercase border-b border-zinc-900 pb-1.5 mb-1.5">
                    <span>API Inscription Terminal</span>
                    <span className="animate-pulse flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> ONLINE</span>
                  </div>
                  {genLogs.map((log, i) => (
                    <div 
                      key={i} 
                      className={`leading-relaxed ${
                        log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' :
                        log.includes('[CRITICAL ERROR]') ? 'text-red-400 font-bold' :
                        log.includes('[AUTHENTICATING]') ? 'text-cyan-400' :
                        'text-zinc-500'
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Interactive Slide Deck Preview & Explorer */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Deck Preview Card */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col min-h-[580px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />
            <CardHeader className="p-0 pb-4 border-b border-zinc-900 flex flex-row items-center justify-between shrink-0">
              <div>
                <CardTitle className="text-xs font-bold uppercase tracking-widest text-zinc-400 font-mono flex items-center gap-1.5">
                  <Layout className="w-4 h-4 text-cyan-400" />
                  Presentation Preview Canvas
                </CardTitle>
                <p className="text-[10px] text-zinc-500">Live viewport of compiled Google Slides representation.</p>
              </div>
              <div className="flex items-center gap-1">
                {selectedPresentationId && (
                  <span className="text-[9px] font-mono px-2 py-1 bg-zinc-900 border border-zinc-800 text-cyan-400 rounded-full font-bold">
                    {selectedPresentationId.startsWith('mock-') ? 'SANDBOX PREVIEW' : 'SYNCHRONIZED DECK'}
                  </span>
                )}
              </div>
            </CardHeader>

            <div className="flex-1 flex flex-col justify-center items-center py-6">
              
              {showSimulatedSlideDeck && selectedAsset ? (
                /* Simulated beautiful CSS presentation slides for Sandbox context */
                <div className="w-full max-w-2xl aspect-[16/9] border border-zinc-800/80 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col bg-zinc-950">
                  {/* Top Bar */}
                  <div className="bg-zinc-900/80 border-b border-zinc-800/50 px-4 py-2 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Presentation className="w-3.5 h-3.5 text-cyan-400" />
                      {selectedAsset.title} - Sovereign Proposal Deck
                    </span>
                    <span>Slide {activeSimulatedSlide + 1} of 4</span>
                  </div>

                  {/* Slide Container */}
                  <div className={`flex-1 p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-br ${activeAssetSlides[activeSimulatedSlide].bgGradient} transition-all duration-500`}>
                    
                    {/* Header */}
                    <div className="space-y-1 text-left">
                      <p className="text-cyan-400 text-[10px] font-mono font-bold tracking-widest uppercase">
                        {activeAssetSlides[activeSimulatedSlide].subtitle}
                      </p>
                      <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                        {activeAssetSlides[activeSimulatedSlide].title}
                      </h3>
                    </div>

                    {/* Content List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 my-4">
                      {activeAssetSlides[activeSimulatedSlide].content.map((item, index) => (
                        <div key={index} className="text-left space-y-1">
                          <p className="text-[9px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                            {item.label}
                          </p>
                          <p className={`text-xs ${item.accent ? 'text-emerald-400 font-bold font-mono' : 'text-zinc-300'} break-all font-sans font-medium leading-relaxed`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-900/80 pt-4 flex items-center justify-between text-[9px] text-zinc-500 font-mono">
                      <span>{activeAssetSlides[activeSimulatedSlide].meta}</span>
                      <span className="text-cyan-400 font-bold">SOVRANLY PROTOCOL</span>
                    </div>

                  </div>

                  {/* Carousel Controls */}
                  <div className="bg-zinc-900/60 border-t border-zinc-800/50 p-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3].map((slideIdx) => (
                        <button
                          key={slideIdx}
                          onClick={() => setActiveSimulatedSlide(slideIdx)}
                          className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                            activeSimulatedSlide === slideIdx ? 'bg-cyan-400 w-4' : 'bg-zinc-700 hover:bg-zinc-500'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={activeSimulatedSlide === 0}
                        onClick={() => setActiveSimulatedSlide(prev => prev - 1)}
                        className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        disabled={activeSimulatedSlide === 3}
                        onClick={() => setActiveSimulatedSlide(prev => prev + 1)}
                        className="h-8 w-8 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : embedUrl ? (
                /* Google Slides embedded iframe representation */
                <div className="w-full max-w-2xl aspect-[16/9] border border-zinc-800 rounded-2xl overflow-hidden relative shadow-2xl">
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    className="absolute inset-0 bg-black"
                  />
                </div>
              ) : (
                /* Empty state screen before selection/compilation */
                <div className="text-center space-y-4 max-w-md p-6 bg-zinc-900/10 border border-dashed border-zinc-900 rounded-2xl">
                  <Presentation className="w-12 h-12 text-zinc-600 mx-auto animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-zinc-400 uppercase">No Deck Loaded</p>
                    <p className="text-xs text-zinc-500 leading-relaxed">
                      Compile a new IP presentation deck using the side panel or choose an existing deck below to launch the presentation preview canvas.
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* Google Drive Presentation Finder */}
            {accessToken && accessToken !== 'sandbox-token-123' && (
              <div className="border-t border-zinc-900 pt-6 space-y-4 shrink-0">
                <div className="flex items-center justify-between">
                  <Label className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
                    Sovereign Google Drive Deck Explorer
                  </Label>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={fetchDrivePresentations}
                    disabled={loadingDrive}
                    className="h-6 w-6 text-zinc-500 hover:text-cyan-400 rounded-full cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingDrive ? 'animate-spin text-cyan-400' : ''}`} />
                  </Button>
                </div>

                {loadingDrive ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                  </div>
                ) : presentations.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 font-mono italic text-center pb-2">
                    No presentation decks found on your Google Drive.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-36 overflow-y-auto pr-1">
                    {presentations.map((deck) => (
                      <button
                        key={deck.id}
                        onClick={() => handleSelectPresentation(deck.id)}
                        className={`text-left p-2.5 rounded-xl border text-xs font-mono transition-all flex items-center justify-between gap-2 cursor-pointer ${
                          selectedPresentationId === deck.id
                            ? 'bg-zinc-900 border-cyan-500/40 text-cyan-400 font-bold'
                            : 'bg-zinc-900/30 border-zinc-900/60 text-zinc-400 hover:bg-zinc-900/40 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Presentation className="w-4 h-4 shrink-0" />
                          <span className="truncate">{deck.name}</span>
                        </div>
                        {deck.webViewLink && (
                          <a
                            href={deck.webViewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 text-zinc-600 hover:text-cyan-400 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </Card>

        </div>

      </div>
    </div>
  );
}
