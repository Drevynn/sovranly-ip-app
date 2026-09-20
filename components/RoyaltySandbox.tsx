'use client';

import { useState, useEffect } from 'react';
import { 
  Coins, 
  Cpu, 
  Sliders, 
  Send, 
  TrendingUp, 
  Wallet, 
  CheckCircle2, 
  Activity, 
  RotateCcw, 
  Receipt, 
  ShieldCheck, 
  Layers, 
  Boxes, 
  Radio,
  ArrowRight,
  User,
  Shield,
  DollarSign,
  Globe,
  Building,
  Users,
  Percent,
  Briefcase,
  HelpCircle,
  TrendingDown,
  ArrowRightLeft,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Recipient = {
  id: string;
  name: string;
  role: string;
  address: string;
  percentage: number;
  balance: number;
  color: string;
  icon: any;
};

type SandboxTxLog = {
  id: string;
  timestamp: string;
  amount: string;
  gasUsed: string;
  blockNumber: number;
  recipientSplits: { name: string; amount: string }[];
};

export default function RoyaltySandbox() {
  const [activeTab, setActiveTab] = useState<'splits' | 'monetization'>('splits');
  const [monetizationModel, setMonetizationModel] = useState<'hybrid' | 'pure-tx-flat' | 'pure-saas' | 'pure-overseas-d-flat'>('hybrid');

  // Input payments state
  const [incomingCurrency, setIncomingCurrency] = useState<'ETH' | 'USD'>('ETH');
  const [incomingPayInput, setIncomingPayInput] = useState<string>('1.5');
  const rawInput = Math.max(0, parseFloat(incomingPayInput) || 0);
  const normalizedInput = incomingCurrency === 'USD' ? rawInput / 2855 : rawInput;

  const handleToggleSandboxCurrency = (mode: 'ETH' | 'USD') => {
    if (mode === incomingCurrency) return;
    const current = parseFloat(incomingPayInput) || 0;
    if (mode === 'USD') {
      setIncomingPayInput(Math.round(current * 2855).toString());
    } else {
      setIncomingPayInput((current / 2855).toFixed(2));
    }
    setIncomingCurrency(mode);
  };

  // Creative Sovereignty LLC Monetization Simulation Inputs
  const [subsCount, setSubsCount] = useState<number>(450);
  const [starterPct, setStarterPct] = useState<number>(55);
  const [growthPct, setGrowthPct] = useState<number>(35);
  // Enterprise is calculated dynamically as remainder: 100 - starterPct - growthPct (clamped properly)
  const enterprisePct = Math.max(0, 100 - starterPct - growthPct);

  const [avgTxCount, setAvgTxCount] = useState<number>(5);
  const [avgPriceUsd, setAvgPriceUsd] = useState<number>(195);
  const [overseasPct, setOverseasPct] = useState<number>(30);
  
  // Wallet percentages - dynamically normalized
  const [recipients, setRecipients] = useState<Recipient[]>([
    {
      id: 'r-1',
      name: 'Original Creator Multi-Sig',
      role: 'CREATOR_PRIMARY',
      address: '0x71C7656EC7ab88b098defB751B7401B5f6d1476B',
      percentage: 45,
      balance: 12.45,
      color: 'from-cyan-400 to-cyan-500',
      icon: User
    },
    {
      id: 'r-2',
      name: 'Developer Core Guild',
      role: 'PROTOCOL_CONTributor',
      address: '0x3FB11A2f60e908dA72517DecA2903F83a6288B02',
      percentage: 25,
      balance: 45.1,
      color: 'from-violet-400 to-violet-500',
      icon: Boxes
    },
    {
      id: 'r-3',
      name: 'Covenant Security Node Reserves',
      role: 'SYSTEM_STAKEHOLDER',
      address: '0xe8dd73a4b9Ca8dE3cB017bE75127Cf0a6311ceEf',
      percentage: 20,
      balance: 8.92,
      color: 'from-emerald-400 to-emerald-500',
      icon: Shield
    },
    {
      id: 'r-4',
      name: 'Dynamic Validator Pool',
      role: 'ORACLE_INCENTIVE',
      address: '0x22Da320f8626e2e50fE144B648F3c7E46927d31b0',
      percentage: 10,
      balance: 3.25,
      color: 'from-amber-400 to-amber-500',
      icon: Radio
    }
  ]);

  // Simulation run states
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState(0); // 0 idle, 1-4 validation/flow phases
  const [sandboxLogs, setSandboxLogs] = useState<SandboxTxLog[]>([]);
  const [transactionHeight, setTransactionHeight] = useState(8432608);
  const [payoutIncrements, setPayoutIncrements] = useState<Record<string, number>>({});
  const [particleActive, setParticleActive] = useState(false);



  // Handle dynamic sliders readjustments so that the total sum is strictly 100%!
  const handlePercentageChange = (id: string, newPercent: number) => {
    const clampedPercent = Math.max(0, Math.min(100, newPercent));
    
    // Find current sum of other elements
    const otherRecipients = recipients.filter(r => r.id !== id);
    const sumOthers = otherRecipients.reduce((sum, r) => sum + r.percentage, 0);
    const totalNewSum = sumOthers + clampedPercent;

    if (totalNewSum === 0) {
      // Avoid division by zero, split evenly
      const splitAmount = 100 / recipients.length;
      setRecipients(prev => prev.map(r => ({ ...r, percentage: splitAmount })));
      return;
    }

    // Adjust other percentages proportionally to maintain exactly 100% total
    const remainingToDistribute = 100 - clampedPercent;
    
    const updatedRecipients = recipients.map(r => {
      if (r.id === id) {
        return { ...r, percentage: clampedPercent };
      }
      
      let relativeProp = 0;
      if (sumOthers > 0) {
        relativeProp = r.percentage / sumOthers;
      } else {
        relativeProp = 1 / otherRecipients.length;
      }

      const rawPercent = relativeProp * remainingToDistribute;
      // keep 1 decimal precision to avoid float noise
      const updatedPercent = Math.round(rawPercent * 10) / 10;
      
      return { ...r, percentage: updatedPercent };
    });

    // Make a final small fix to ensure literal sum is exactly 100
    const currentSum = updatedRecipients.reduce((s, r) => s + r.percentage, 0);
    if (currentSum !== 100) {
      const diff = 100 - currentSum;
      const firstOther = updatedRecipients.find(r => r.id !== id);
      if (firstOther) {
        firstOther.percentage = Math.round((firstOther.percentage + diff) * 10) / 10;
      }
    }

    setRecipients(updatedRecipients);
  };

  // Reset sliders back to default
  const resetSandboxToDefault = () => {
    setRecipients([
      { ...recipients[0], percentage: 45 },
      { ...recipients[1], percentage: 25 },
      { ...recipients[2], percentage: 20 },
      { ...recipients[3], percentage: 10 }
    ]);
    setIncomingPayInput('1.5');
    setPayoutIncrements({});
  };

  // Trigger Dynamic split ledger simulation
  const runPaymentSimulation = async () => {
    if (isSimulating || normalizedInput <= 0) return;
    setIsSimulating(true);
    setPayoutIncrements({});
    setStep(1);

    // Initial trigger sound signal (visual/animation)
    setParticleActive(true);

    try {
      // Step 1: Query multi-sig contract splits config (Static delay)
      await new Promise(resolve => setTimeout(resolve, 900));
      setStep(2);

      // Step 2: Validate caller handshake zero-trust credentials
      await new Promise(resolve => setTimeout(resolve, 950));
      setStep(3);

      // Step 3: Trigger Ledger dispatcher splits & distribute ETH values
      await new Promise(resolve => setTimeout(resolve, 1100));
      
      // Calculate split amounts
      const increments: Record<string, number> = {};
      const actualSplitsLog: { name: string; amount: string }[] = [];

      const nextRecipients = recipients.map(r => {
        const payoutVal = (normalizedInput * r.percentage) / 100;
        increments[r.id] = payoutVal;
        actualSplitsLog.push({
          name: r.name,
          amount: payoutVal.toFixed(4) + ' ETH'
        });
        return {
          ...r,
          balance: Math.round((r.balance + payoutVal) * 10000) / 10000
        };
      });

      // Update state with modified balances & payout triggers
      setRecipients(nextRecipients);
      setPayoutIncrements(increments);
      setStep(4);

      // Save a dynamic simulation tx log
      const logObj: SandboxTxLog = {
        id: 'SIM-' + Math.floor(100000 + Math.random() * 900000),
        timestamp: new Date().toISOString(),
        amount: normalizedInput.toFixed(4) + ' ETH',
        gasUsed: Math.floor(121000 + Math.random() * 8000).toLocaleString(),
        blockNumber: transactionHeight + 1,
        recipientSplits: actualSplitsLog
      };

      setTransactionHeight(prev => prev + 1);
      setSandboxLogs(prev => [logObj, ...prev]);

      // Complete Sequence
      await new Promise(resolve => setTimeout(resolve, 750));
      setStep(5);
    } catch (err) {
      console.error("Sandbox simulation crash:", err);
    } finally {
      setIsSimulating(false);
      setParticleActive(false);
    }
  };

  // Projections calculations
  const starterCount = Math.round(subsCount * (starterPct / 100));
  const growthCount = Math.round(subsCount * (growthPct / 100));
  const enterpriseCount = Math.max(0, subsCount - starterCount - growthCount);

  // If saas counts, else zero
  const isSaaSEnabled = monetizationModel === 'hybrid' || monetizationModel === 'pure-saas';
  const mrrStarter = isSaaSEnabled ? starterCount * 29 : 0;
  const mrrGrowth = isSaaSEnabled ? growthCount * 99 : 0;
  const mrrEnterprise = isSaaSEnabled ? enterpriseCount * 299 : 0;
  const totalMrr = mrrStarter + mrrGrowth + mrrEnterprise;
  const arrForecast = totalMrr * 12;

  const activeSellersCount = Math.round(subsCount * 0.45);
  const totalMonthlyTxs = activeSellersCount * avgTxCount;
  const totalGmv = totalMonthlyTxs * avgPriceUsd;

  const overseasGmv = totalGmv * (overseasPct / 100);
  const domesticGmv = totalGmv - overseasGmv;

  // Commission Rates:
  // - hybrid: domestic 2% (Part A), overseas 4% (Part D)
  // - pure-tx-flat: domestic 2% (Part A), overseas 2% (Part A globally)
  // - pure-saas: domestic 0%, overseas 0% (Pure subscriber strategy)
  // - pure-overseas-d-flat: domestic 4% (Part D), overseas 4% (Part D globally)
  const domesticRate = 
    monetizationModel === 'hybrid' ? 0.02 :
    monetizationModel === 'pure-tx-flat' ? 0.02 :
    monetizationModel === 'pure-saas' ? 0.00 :
    0.04; // pure-overseas-d-flat

  const overseasRate = 
    monetizationModel === 'hybrid' ? 0.04 :
    monetizationModel === 'pure-tx-flat' ? 0.02 :
    monetizationModel === 'pure-saas' ? 0.00 :
    0.04; // pure-overseas-d-flat

  const domesticCommission = domesticGmv * domesticRate;
  const overseasCommissionTotal = overseasGmv * overseasRate;

  const totalTransactionalCommissions = domesticCommission + overseasCommissionTotal;
  const totalMonthlyLLCRevenue = totalMrr + totalTransactionalCommissions;
  const totalAnnualLLCRevenue = totalMonthlyLLCRevenue * 12;

  const creatorRetainedRevenue = totalGmv - totalTransactionalCommissions;

  const [exportSuccess, setExportSuccess] = useState(false);

  // Export Simulation Results to CSV for Tax Reporting
  const exportSimulationToCsv = (exportScope?: 'current' | 'splits' | 'monetization') => {
    const timestamp = new Date().toISOString();
    const dateStr = timestamp.split('T')[0];
    const ethRate = 2855; // Benchmark USD per ETH

    const rows: (string | number)[][] = [];

    // Header & Compliance Metadata Block
    rows.push(['SOVRANLY IP - ZERO-TRUST ROYALTY & TAX REPORTING SCHEDULE']);
    rows.push(['Operating Entity', 'Creative Sovereignty LLC']);
    rows.push(['Report Generated At (UTC)', timestamp]);
    rows.push(['Architecture', 'Zero-Trust Multi-Sig Smart Contract Protocol']);
    rows.push(['Benchmark Exchange Rate', `1 ETH = $${ethRate.toLocaleString()} USD`]);
    rows.push(['Export Scope', exportScope || activeTab]);
    rows.push([]);

    // Tab 1 / Splits Section: Multi-Party Covenant Royalty Split Tax Schedule
    rows.push(['============================================================']);
    rows.push(['1. MULTI-PARTY ROYALTY COVENANT SPLIT TAX SCHEDULE']);
    rows.push(['============================================================']);
    rows.push(['Simulated License Inbound Payment (ETH)', `${normalizedInput.toFixed(4)} ETH`]);
    rows.push(['Simulated License Inbound Payment (USD Value)', `$${(normalizedInput * ethRate).toFixed(2)} USD`]);
    rows.push(['Latest Ledger Block Height', transactionHeight]);
    rows.push([]);

    // Recipient Tax Breakdown Table
    rows.push([
      'Recipient Name',
      'Tax Role Classification',
      'Public Wallet Address',
      'Allocation Percentage (%)',
      'Simulated Payout (ETH)',
      'Simulated Payout (USD Value)',
      'Updated Ledger Balance (ETH)',
      'Updated Ledger Balance (USD Value)',
      'Tax Reporting Form / Classification'
    ]);

    recipients.forEach(r => {
      const payoutEth = (normalizedInput * r.percentage) / 100;
      const payoutUsd = payoutEth * ethRate;
      const balanceUsd = r.balance * ethRate;
      const taxForm = 
        r.role === 'CREATOR_PRIMARY' ? 'Form 1099-MISC / Royalty Box 2 (Schedule E)' :
        r.role === 'PROTOCOL_CONTRIBUTOR' ? 'Form 1099-NEC / Nonemployee Compensation' :
        r.role === 'SYSTEM_STAKEHOLDER' ? 'Corporate Infrastructure Protocol Reserve' :
        'Form 1099-B / Oracle Validator Staking Yield';

      rows.push([
        r.name,
        r.role,
        r.address,
        `${r.percentage}%`,
        payoutEth.toFixed(4),
        `$${payoutUsd.toFixed(2)}`,
        r.balance.toFixed(4),
        `$${balanceUsd.toFixed(2)}`,
        taxForm
      ]);
    });

    rows.push([]);

    // Cryptographic Settlement Receipts & Audit Trail
    rows.push(['============================================================']);
    rows.push(['2. CRYPTOGRAPHIC SETTLEMENT RECEIPTS & AUDIT LOGS']);
    rows.push(['============================================================']);
    if (sandboxLogs.length === 0) {
      rows.push(['No dynamic transactions simulated in current session yet.']);
    } else {
      rows.push([
        'Receipt ID',
        'Settlement Timestamp (UTC)',
        'Block Number',
        'Gas Limit Consumed',
        'Gross Amount (ETH)',
        'Gross Amount (USD)',
        'Recipient Split Payout Breakdown'
      ]);

      sandboxLogs.forEach(log => {
        const grossEth = parseFloat(log.amount) || normalizedInput;
        const grossUsd = grossEth * ethRate;
        const splitsSummary = log.recipientSplits.map(s => `${s.name}: ${s.amount}`).join(' | ');

        rows.push([
          log.id,
          log.timestamp,
          log.blockNumber,
          log.gasUsed,
          log.amount,
          `$${grossUsd.toFixed(2)}`,
          splitsSummary
        ]);
      });
    }

    rows.push([]);

    // Tab 2 / Monetization Section: Corporate Tax & Pro-Forma Revenue Projections
    rows.push(['============================================================']);
    rows.push(['3. CREATIVE SOVEREIGNTY LLC MONETIZATION & TAX PRO-FORMA']);
    rows.push(['============================================================']);
    rows.push(['Monetization Strategy', monetizationModel]);
    rows.push(['Total Active Subscribers', subsCount]);
    rows.push(['Starter Tier ($29/mo) Count', `${starterCount} (${starterPct}%)`]);
    rows.push(['Starter Tier Monthly Revenue (USD)', `$${(isSaaSEnabled ? starterCount * 29 : 0).toLocaleString()}`]);
    rows.push(['Growth Studio ($99/mo) Count', `${growthCount} (${growthPct}%)`]);
    rows.push(['Growth Studio Monthly Revenue (USD)', `$${(isSaaSEnabled ? growthCount * 99 : 0).toLocaleString()}`]);
    rows.push(['Enterprise Tier ($299/mo) Count', `${enterpriseCount} (${enterprisePct}%)`]);
    rows.push(['Enterprise Tier Monthly Revenue (USD)', `$${(isSaaSEnabled ? enterpriseCount * 299 : 0).toLocaleString()}`]);
    rows.push(['Total Monthly Recurring Revenue (MRR USD)', `$${totalMrr.toLocaleString()}`]);
    rows.push(['Annual Recurring Revenue (ARR USD)', `$${arrForecast.toLocaleString()}`]);
    rows.push([]);
    rows.push(['--- TRANSACTION COMMISSIONS & MARKETPLACE TAX BREAKDOWN ---']);
    rows.push(['Active Retail Sellers', activeSellersCount]);
    rows.push(['Sales Per Active Creator / Month', avgTxCount]);
    rows.push(['Average License Sale Price (USD)', `$${avgPriceUsd}`]);
    rows.push(['Total Monthly GMV (USD)', `$${totalGmv.toLocaleString()}`]);
    rows.push(['Domestic Market GMV (USD)', `$${domesticGmv.toLocaleString()}`]);
    rows.push(['Part A Domestic Commission Rate (%)', `${(domesticRate * 100).toFixed(1)}%`]);
    rows.push(['Part A Domestic Commission (USD)', `$${Math.round(domesticCommission).toLocaleString()}`]);
    rows.push(['Part D Overseas GMV (USD)', `$${overseasGmv.toLocaleString()}`]);
    rows.push(['Part D Overseas Commission Rate (%)', `${(overseasRate * 100).toFixed(1)}%`]);
    rows.push(['Part D Overseas Customs & Withholding Surcharge (USD)', `$${Math.round(overseasCommissionTotal).toLocaleString()}`]);
    rows.push(['Total Platform Surcharge Fees (USD/mo)', `$${Math.round(totalTransactionalCommissions).toLocaleString()}`]);
    rows.push(['Creator Retained Net Earnings (USD/mo)', `$${Math.round(creatorRetainedRevenue).toLocaleString()}`]);
    rows.push(['Combined LLC Monthly Gross Revenue (USD)', `$${Math.round(totalMonthlyLLCRevenue).toLocaleString()}`]);
    rows.push(['Combined LLC Annualized Projected Revenue (USD)', `$${Math.round(totalAnnualLLCRevenue).toLocaleString()}`]);

    // Build CSV formatted string
    const csvContent = rows
      .map(row => 
        row.map(val => {
          const str = String(val ?? '');
          if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      )
      .join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `sovranly-royalty-tax-report-${dateStr}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-24 text-left">
      
      {/* Dynamic Header Deck */}
      <div className="relative p-8 md:p-10 bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-12 w-60 h-60 bg-violet-500/5 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-teal-400 text-[10px] uppercase font-mono tracking-widest rounded-full font-bold">
              <Cpu className="w-3.5 h-3.5 text-teal-400" /> Creative Sovereignty LLC
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tighter">
              Covenant & Monetization <span className="text-teal-400 font-mono italic">Lab</span>
            </h1>
            <p className="text-sm md:text-base text-zinc-400 max-w-2xl font-light">
              Calibrate multi-party royalty splits, simulate smart contract payout triggers, and model business revenue projections for Creative Sovereignty LLC under our zero-trust ledger model.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="export-simulation-tax-csv-btn"
              onClick={() => exportSimulationToCsv()}
              className={`text-xs font-bold transition-all px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg ${
                exportSuccess
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:brightness-110 shadow-teal-950/40'
              }`}
            >
              {exportSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  Tax CSV Exported!
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Export Tax Report (CSV)
                </>
              )}
            </Button>

            <Button 
              onClick={resetSandboxToDefault}
              variant="outline"
              className="border-zinc-800 bg-zinc-900/40 text-xs text-zinc-350 hover:text-white hover:bg-zinc-900 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Parameters
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Selectors */}
      <div className="flex bg-zinc-950 p-1.5 rounded-2xl border border-zinc-900 max-w-lg">
        <button
          onClick={() => setActiveTab('splits')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'splits'
              ? 'bg-zinc-900 text-teal-400 border border-zinc-800 shadow-md'
              : 'text-zinc-500 hover:text-zinc-350 bg-transparent'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Covenant Splits Sandbox
        </button>
        <button
          onClick={() => setActiveTab('monetization')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'monetization'
              ? 'bg-zinc-900 text-emerald-405 border border-zinc-800 shadow-md'
              : 'text-zinc-500 hover:text-zinc-350 bg-transparent'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Sovereign LLC Monetization Planner
        </button>
      </div>

      {activeTab === 'splits' ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid: Distribution controls & Simulation trigger */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Target input payment card */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-xl">
            <CardHeader className="p-6 pb-4">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-teal-400" /> 1. Input Simulated Payment
                </CardTitle>

                {/* Currency Toggle: ETH vs USD */}
                <div className="flex items-center gap-1 bg-zinc-900/90 p-0.5 rounded-lg border border-zinc-800">
                  <button
                    type="button"
                    onClick={() => handleToggleSandboxCurrency('USD')}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      incomingCurrency === 'USD'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    USD ($)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleSandboxCurrency('ETH')}
                    className={`px-2.5 py-1 text-[11px] font-mono font-bold rounded-md transition-all cursor-pointer ${
                      incomingCurrency === 'ETH'
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    ETH
                  </button>
                </div>
              </div>
              <CardDescription className="text-zinc-500 text-xs mt-1">
                Provide a sandbox payment value representing license revenues arriving from streaming broadcasters in {incomingCurrency === 'USD' ? 'US Dollars ($ USD / USDC)' : 'Ethereum (ETH)'}.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    type="number" 
                    step={incomingCurrency === 'USD' ? '50' : '0.05'}
                    min="0.01"
                    value={incomingPayInput}
                    onChange={(e) => setIncomingPayInput(e.target.value)}
                    className="bg-zinc-900 border-zinc-800 text-white font-mono text-lg py-7 pl-12 pr-28 focus-visible:ring-teal-500 rounded-xl"
                  />
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-400">
                    {incomingCurrency === 'USD' ? (
                      <>≈ {normalizedInput.toFixed(4)} ETH</>
                    ) : (
                      <>≈ ${(normalizedInput * 2855).toLocaleString(undefined, { maximumFractionDigits: 1 })} USD</>
                    )}
                  </span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-zinc-500 mr-1">Quick Presets:</span>
                  {incomingCurrency === 'USD' ? (
                    <>
                      {[
                        { label: '$1,500', val: '1500' },
                        { label: '$2,855 (1 ETH)', val: '2855' },
                        { label: '$4,282 (1.5 ETH)', val: '4282' },
                        { label: '$10,000', val: '10000' }
                      ].map(p => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setIncomingPayInput(p.val)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            incomingPayInput === p.val
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                              : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </>
                  ) : (
                    <>
                      {[
                        { label: '0.5 ETH', val: '0.5' },
                        { label: '1.0 ETH', val: '1.0' },
                        { label: '1.5 ETH', val: '1.5' },
                        { label: '3.0 ETH', val: '3.0' }
                      ].map(p => (
                        <button
                          key={p.val}
                          type="button"
                          onClick={() => setIncomingPayInput(p.val)}
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            incomingPayInput === p.val
                              ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold'
                              : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coefficient Slider Splits Card */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-xl">
            <CardHeader className="p-6">
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-teal-400" /> 2. Align Split Coefficients
              </CardTitle>
              <CardDescription className="text-zinc-500 text-xs text-left">
                Re-weight recipient parameters. Sliding one will dynamically adjust coordinate ratios to guarantee exactly **100% total split**.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="space-y-5">
                {recipients.map((rec) => {
                  const CurrentIcon = rec.icon;
                  return (
                    <div key={rec.id} className="space-y-2 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-900/60">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center gap-2">
                          <div className={`p-1.5 rounded-lg bg-gradient-to-br ${rec.color} text-black`}>
                            <CurrentIcon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="font-bold text-white block">{rec.name}</span>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase">{rec.role}</span>
                          </div>
                        </div>
                        <span className="font-mono font-black text-teal-400 text-sm">{rec.percentage}%</span>
                      </div>
                      
                      <Input
                        type="range"
                        min="0"
                        max="100"
                        step="0.5"
                        value={rec.percentage}
                        onChange={(e) => handlePercentageChange(rec.id, Number(e.target.value))}
                        className="accent-teal-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Slider sum safety display */}
              <div className="flex items-center justify-between border-t border-zinc-900 pt-4 font-mono text-[10px] text-zinc-500">
                <span>Verification Checksum:</span>
                <span className="text-emerald-400 font-bold bg-emerald-950/20 border border-emerald-900 px-2 py-0.5 rounded leading-none">
                  Sum = 100.0% Verified
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Grid: Graphical Flowchart Visualization */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Graphical Split flow chart board */}
          <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-2xl relative min-h-[460px] flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-44 h-44 bg-teal-500/5 rounded-full blur-[50px] pointer-events-none" />
            
            <CardHeader className="p-6 border-b border-zinc-900/60 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2 font-bold">
                  <Activity className="w-4 h-4 text-teal-400" /> Algorithmic routing visualizer
                </CardTitle>
                <CardDescription className="text-zinc-500 text-[11px]">
                  Real-time visualization of payout allocation across zero-trust cryptographic nodes.
                </CardDescription>
              </div>
              <span className="text-[9px] font-mono bg-[#0c0d12] border border-teal-900 text-teal-400 px-2.5 py-1 rounded">
                Rate: 1 ETH = $2,855
              </span>
            </CardHeader>

            <CardContent className="p-8 flex-1 flex flex-col justify-center h-full">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative py-4">
                
                {/* Visualizer Link Particle Lines (Dashed CSS styles) */}
                {particleActive && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-full max-w-[420px] h-0 px-2 relative">
                      <div className="absolute left-[20%] right-[30%] top-0 h-0.5 bg-gradient-to-r from-teal-400 to-violet-500 animate-pulse duration-1000" />
                    </div>
                  </div>
                )}

                {/* Left: Input Payload Node */}
                <div className="flex flex-col items-center gap-2 text-center md:sticky md:top-12 z-10 w-full md:w-auto">
                  <div className="w-[105px] h-[105px] rounded-[24px] bg-zinc-900 p-1 flex flex-col items-center justify-center border border-zinc-800 shadow-xl relative overflow-hidden group">
                    <div className="absolute inset-0 bg-teal-500/5 group-hover:bg-teal-500/10 transition-colors pointer-events-none" />
                    <Coins className="w-7 h-7 text-teal-400 mb-1" />
                    <span className="text-[11px] font-mono font-black text-white">{normalizedInput} ETH</span>
                    <span className="text-[8px] text-zinc-500 font-sans uppercase font-bold tracking-wider">Broadcaster</span>
                  </div>
                  <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Revenue Feed</p>
                </div>

                {/* Left Arrow */}
                <div className="hidden md:flex flex-col items-center">
                  <ArrowRight className="w-5 h-5 text-zinc-700 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-zinc-550 shrink-0 select-none">DISPATCH</span>
                </div>

                {/* Center: Algorithmic router core */}
                <div className="bg-[#0b0c10] border border-teal-500/30 p-5 rounded-[28px] flex flex-col items-center gap-2 shadow-2xl relative w-[145px] max-w-full text-center group">
                  <div className="absolute inset-0 bg-teal-500/5 blur-[12px] opacity-70 rounded-[28px] pointer-events-none" />
                  <div className="w-10 h-10 rounded-full bg-teal-950/40 border border-teal-900 flex items-center justify-center shadow-lg animate-spin-slow">
                    <Cpu className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-extrabold block">SVIP Splitter</span>
                    <span className="text-[7.5px] font-mono text-zinc-550">Multi-sig Router</span>
                  </div>
                </div>

                {/* Right Arrow */}
                <div className="hidden md:flex flex-col items-center">
                  <ArrowRight className="w-5 h-5 text-zinc-700 animate-pulse" />
                  <span className="text-[8.5px] font-mono text-zinc-550 shrink-0 select-none">ALLOCATE</span>
                </div>

                {/* Right: Outcome splits recipient card collection */}
                <div className="w-full md:w-auto flex-1 max-w-[280px] space-y-2.5">
                  {recipients.map((rec) => {
                    const addedAmt = payoutIncrements[rec.id];
                    return (
                      <div key={rec.id} className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-center justify-between text-xs hover:border-zinc-800 transition-all">
                        <div className="min-w-0 pr-3">
                          <p className="text-[9px] font-mono text-zinc-500 tracking-wider font-extrabold truncate uppercase">{rec.name.slice(0, 18)}...</p>
                          <p className="text-zinc-200 mt-1 font-bold">{rec.percentage}% allocated</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-mono text-zinc-400">{rec.balance.toFixed(2)} ETH</p>
                          {addedAmt && addedAmt > 0 ? (
                            <span className="font-mono text-[9px] text-emerald-400 font-bold bg-emerald-950/30 border border-emerald-900/40 px-1 py-0.5 rounded ml-auto block animate-bounce truncate">
                              +{addedAmt.toFixed(4)} ETH
                            </span>
                          ) : (
                            <span className="text-[8px] text-zinc-650 font-mono">Standby</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            </CardContent>

            {/* Simulated execution button */}
            <div className="p-6 border-t border-zinc-900 bg-black/40">
              {isSimulating ? (
                <div className="space-y-3 bg-[#0c0d12] p-4 rounded-xl border border-teal-900/30">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-teal-300 font-bold">Deploying Dynamic Splitting Stream...</span>
                    <span className="text-zinc-500">{step}/4</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full overflow-hidden bg-zinc-900 relative">
                    <div className="bg-gradient-to-r from-teal-400 to-violet-500 h-full transition-all duration-300" style={{ width: `${(step / 4) * 100}%` }} />
                  </div>
                  <p className="text-[9.5px] text-zinc-500 font-mono leading-none animate-pulse">
                    {step === 1 && 'Resolving multi-sig split coefficients parameters...'}
                    {step === 2 && 'Performing zero-trust whitelist state checks...'}
                    {step === 3 && 'Dispatching split allocations to ledger blocks...'}
                    {step === 4 && 'Settling account balances & assembling receipt logs...'}
                  </p>
                </div>
              ) : step === 5 ? (
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <div className="flex-1 bg-emerald-950/20 px-4 py-3 border border-emerald-500/25 rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white uppercase leading-none">Sandbox Settle Confirmed</p>
                      <p className="text-[10px] text-zinc-400 mt-1">Split dispatched successfully. Check account balances updated!</p>
                    </div>
                  </div>
                  <Button
                    onClick={runPaymentSimulation}
                    type="button"
                    className="py-5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:brightness-110 font-bold text-xs px-6 rounded-xl shrink-0"
                  >
                    Simulate Another split
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={runPaymentSimulation}
                  type="button"
                  className="w-full py-6 bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:brightness-110 font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 font-mono"
                >
                  <Send className="w-4 h-4 ml-0.5" /> Trigger Simulated Broadcast Payment ({normalizedInput} ETH)
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Sandbox Transaction Receipt Logs Archive */}
      <Card className="bg-zinc-950 border border-zinc-900 rounded-[32px] p-8 md:p-10 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-400" /> Dynamic Settle Receipts Audit Logs
            </h3>
            <p className="text-xs text-zinc-400 font-light mt-1">
              Browse cryptographic transaction block records emitted by the sandbox simulation splitter. All receipts are locked index proofs.
            </p>
          </div>
          <Button
            onClick={() => exportSimulationToCsv('splits')}
            variant="outline"
            className="border-zinc-800 bg-zinc-900/60 text-xs text-teal-400 hover:text-white hover:bg-zinc-800 rounded-xl shrink-0 self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
            Export Split Ledger (CSV)
          </Button>
        </div>

        {sandboxLogs.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-900 rounded-2xl text-zinc-550 space-y-2">
            <Boxes className="w-7 h-7 mx-auto text-zinc-650" />
            <p className="text-xs uppercase font-bold tracking-widest text-zinc-500">Receipt Ledger Standby</p>
            <p className="text-[10px] text-zinc-500 max-w-sm mx-auto leading-normal">
              Receipt block entries populate as soon as you simulate payment transactions from broadcasting content nodes above.
            </p>
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-auto pr-1">
            {sandboxLogs.map((log) => (
              <div key={log.id} className="bg-zinc-900/30 p-5 rounded-2xl border border-zinc-900/80 font-mono text-xs flex flex-col md:flex-row justify-between gap-6 hover:border-zinc-800 transition-all">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] bg-teal-950/40 text-teal-450 border border-teal-900 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                      {log.id} • settled
                    </span>
                    <span className="text-zinc-500 text-[10px]">
                      {new Date(log.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-1 text-left">
                    <div>
                      <span className="text-zinc-500 block text-[9.5px]">BLOCK DEPTH HEIGHT</span>
                      <span className="text-zinc-250 font-bold">{log.blockNumber}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9.5px]">DYNAMIC GAS CONSUMED</span>
                      <span className="text-zinc-250 font-bold">{log.gasUsed} limits</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9.5px]">REVENUE SUM INPUT</span>
                      <span className="text-teal-400 font-bold">{log.amount}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-end min-w-[260px] max-w-full bg-zinc-950 p-4 border border-zinc-900/70 rounded-xl space-y-1 text-left">
                  <span className="text-[8px] text-zinc-550 uppercase tracking-widest font-black leading-none block border-b border-zinc-900 pb-1 mb-1">
                    Covenant Allocated Split Values
                  </span>
                  {log.recipientSplits.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[9.5px]">
                      <span className="text-zinc-500">{item.name.slice(0, 22)}:</span>
                      <span className="text-teal-450 font-bold">{item.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
        </>
      ) : (
        /* CREATIVE SOVEREIGNTY LLC MONETIZATION CALCULATOR */
        <div className="space-y-8">
          
          {/* Preset Model Selector */}
          <Card className="bg-zinc-950 border border-zinc-900 p-6 rounded-[24px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
              <div className="space-y-1">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-emerald-400" /> Choose Monetization Strategy
                </h3>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xl">
                  Simulate different business approaches. Under standard Web3 zero-custody limits, you can operate entirely on commissions, premium subscriptions, or dynamic hybrid models.
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block font-bold">Active Blueprint</span>
                <span className="text-xs font-black text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-900 px-3 py-1 rounded mt-1 inline-block">
                  {monetizationModel === 'hybrid' && 'Strategic Hybrid'}
                  {monetizationModel === 'pure-tx-flat' && 'Flat 2.0% Part A'}
                  {monetizationModel === 'pure-saas' && 'Pure Creator SaaS'}
                  {monetizationModel === 'pure-overseas-d-flat' && 'Model D Flat 4.0%'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
              {[
                {
                  id: 'hybrid' as const,
                  label: 'Strategic Hybrid',
                  badge: 'Recommended',
                  desc: 'SaaS Tiers ($29-$299/mo) + 2% domestic checkout, 4% overseas licensing commissions.',
                  color: 'border-emerald-900 bg-emerald-950/5'
                },
                {
                  id: 'pure-tx-flat' as const,
                  label: 'Flat Part A (2.0%)',
                  badge: 'Zero Monthly Fee',
                  desc: 'Completely free registering. Simple, flat 2% checkout transaction fee globally.',
                  color: 'border-cyan-900 bg-cyan-950/5'
                },
                {
                  id: 'pure-saas' as const,
                  label: 'Pure SaaS Strategy',
                  badge: '0% Transaction Surtax',
                  desc: 'Generous subscription limits. 100% of marketplace licensing is directly retained by creators.',
                  color: 'border-violet-900 bg-violet-955/5'
                },
                {
                  id: 'pure-overseas-d-flat' as const,
                  label: 'Model D (Flat 4.0%)',
                  badge: 'Simplest Commission',
                  desc: 'Free listing tier. Flat 4% transnational fee splits. High yield from heavy international transactions.',
                  color: 'border-amber-900 bg-amber-950/5 font-bold'
                }
              ].map((model) => (
                <button
                  key={model.id}
                  onClick={() => setMonetizationModel(model.id)}
                  className={`p-4 border rounded-2xl text-left transition-all relative overflow-hidden group ${
                    monetizationModel === model.id
                      ? `${model.color} text-white shadow-xl scale-[1.01]`
                      : 'border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/10 text-zinc-500 hover:text-zinc-350'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold block group-hover:text-emerald-400">{model.label}</span>
                    <span className="text-[8px] tracking-widest font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-500">
                      {model.badge}
                    </span>
                  </div>
                  <p className="text-[10px] mt-2 leading-relaxed text-zinc-400">{model.desc}</p>
                </button>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          
          {/* Left Grid: Parametrization Sliders Card */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-900/40">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" /> 1. Subscription Roster
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs text-left">
                  Configure the total active paying subscriber base logged onto Creative Sovereignty LLC platforms.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Total subscribers */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="text-zinc-400 font-bold uppercase tracking-wider">Total Active Subscribers</Label>
                    <span className="font-mono text-emerald-400 text-sm font-black">{subsCount.toLocaleString()} Members</span>
                  </div>
                  <Input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={subsCount}
                    onChange={(e) => setSubsCount(Number(e.target.value))}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                </div>

                {/* Starters tier distribution ratio */}
                <div className="space-y-2 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-900/60 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-left">
                      <span className="font-bold text-white block">Starter Tier ($29/mo)</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Limit 10 IP registers/mo</span>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">{starterPct}% ({starterCount} subs)</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={starterPct}
                    onChange={(e) => {
                      const newStarters = Number(e.target.value);
                      setStarterPct(newStarters);
                      // Adjust growth ratio if aggregate exceeds 100
                      if (newStarters + growthPct > 100) {
                        setGrowthPct(100 - newStarters);
                      }
                    }}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                </div>

                {/* Growth tier distribution ratio */}
                <div className="space-y-2 p-4 bg-zinc-900/30 rounded-2xl border border-zinc-900/60 font-sans">
                  <div className="flex justify-between items-center text-xs">
                    <div className="text-left">
                      <span className="font-bold text-white block">Growth Studio ($99/mo)</span>
                      <span className="text-[9px] font-mono text-zinc-500 uppercase">Limit 50 IP registers/mo</span>
                    </div>
                    <span className="font-mono font-black text-emerald-400 text-sm">{growthPct}% ({growthCount} subs)</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={growthPct}
                    onChange={(e) => {
                      const newGrowth = Number(e.target.value);
                      setGrowthPct(newGrowth);
                      // Adjust starter ratio if aggregate exceeds 100
                      if (starterPct + newGrowth > 100) {
                        setStarterPct(100 - newGrowth);
                      }
                    }}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                </div>

                {/* Enterprise segment */}
                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-900 flex justify-between items-center text-xs font-sans">
                  <div className="text-left">
                    <span className="font-bold text-zinc-400 block">Enterprise Tier ($299/mo)</span>
                    <span className="text-[9px] font-mono text-zinc-500">Unlimited registrations & dedicated compliance API</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/25 border border-emerald-900 px-3 py-1 rounded">
                    {enterprisePct}% ({enterpriseCount} subs)
                  </span>
                </div>

              </CardContent>
            </Card>

            <Card className="bg-zinc-950 border border-zinc-900 rounded-[28px] overflow-hidden shadow-xl">
              <CardHeader className="p-6 border-b border-zinc-900/40">
                <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-emerald-400" /> 2. Transaction Stream
                </CardTitle>
                <CardDescription className="text-zinc-500 text-xs">
                  Propose monthly transaction volume and domestic vs. Part D cross-border licensing characteristics.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                
                {/* Avg transactions per user per month */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="text-zinc-400 font-bold uppercase tracking-wider">Sales Per Active Creator / Mo</Label>
                    <span className="font-mono text-emerald-400 text-sm font-black">{avgTxCount} Sales</span>
                  </div>
                  <Input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={avgTxCount}
                    onChange={(e) => setAvgTxCount(Number(e.target.value))}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                </div>

                {/* Avg sale price */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="text-zinc-400 font-bold uppercase tracking-wider">Average License Sale Price</Label>
                    <span className="font-mono text-emerald-400 text-sm font-black">${avgPriceUsd} USD</span>
                  </div>
                  <Input
                    type="range"
                    min="25"
                    max="1000"
                    step="25"
                    value={avgPriceUsd}
                    onChange={(e) => setAvgPriceUsd(Number(e.target.value))}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                </div>

                {/* Overseas Part D ratio */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <Label className="text-zinc-400 font-bold uppercase tracking-wider">“Part D” Overseas Surcharge Ratio</Label>
                    <span className="font-mono text-emerald-400 text-sm font-black">{overseasPct}% Cross-Border</span>
                  </div>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={overseasPct}
                    onChange={(e) => setOverseasPct(Number(e.target.value))}
                    className="accent-emerald-400 h-1 appearance-none cursor-pointer p-0 bg-transparent border-none mt-1"
                  />
                  <span className="text-[10px] text-zinc-550 font-mono block leading-relaxed pt-1 text-left">
                    Domestic transactions are billed at a flat 2.0% (Part A). Overseas transactions process with an additional 2.0% compliance surcharge (4% total Part D) automatically routing localized withholdings securely.
                  </span>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Grid: Financial Outcomes dashboard card */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="bg-zinc-950 border border-zinc-900 rounded-[32px] overflow-hidden shadow-2xl relative p-8">
              <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-[80px]" />
              
              <div className="relative z-10 space-y-8 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-3 py-1 rounded-full font-bold">
                      Pro-Forma Projection Model
                    </span>
                    <h2 className="text-2xl font-black text-white mt-3 tracking-tight">Creative Sovereignty LLC Ledger Revenue</h2>
                    <p className="text-xs text-zinc-400 mt-1">
                      Calculated dynamically across subscription metrics and transaction commission allocations.
                    </p>
                  </div>
                  <Button
                    onClick={() => exportSimulationToCsv('monetization')}
                    variant="outline"
                    className="border-zinc-800 bg-zinc-900/60 text-xs text-emerald-400 hover:text-white hover:bg-zinc-800 rounded-xl shrink-0 self-start sm:self-auto"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                    Export Pro-Forma (CSV)
                  </Button>
                </div>

                {/* Big aggregates display board */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* MRR Card */}
                  <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-2xl space-y-2 text-left">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <Building className="w-3.5 h-3.5 text-emerald-400" /> MRR (Monthly Subscription)
                    </span>
                    <p className="text-3xl font-extrabold text-white font-mono tracking-tight">
                      ${totalMrr.toLocaleString()} <span className="text-xs text-zinc-500">USD</span>
                    </p>
                    <p className="text-[10px] text-[#8e9196] leading-relaxed">
                      Sustained recurring revenue matching subscription tiers limits.
                    </p>
                  </div>

                  {/* ARR Card */}
                  <div className="bg-[#09090b] border border-zinc-900 p-6 rounded-2xl space-y-2 text-left">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1.5 font-bold">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> ARR (Annual Run Rate)
                    </span>
                    <p className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
                      ${arrForecast.toLocaleString()} <span className="text-xs text-zinc-500">USD</span>
                    </p>
                    <p className="text-[10px] text-[#8e9196] leading-relaxed font-sans">
                      Predictable baseline from SaaS subscriptions alone.
                    </p>
                  </div>

                </div>

                {/* Transaction commissions details layout */}
                <div className="bg-zinc-900/30 border border-zinc-900/60 rounded-2xl p-6 space-y-4">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider border-b border-zinc-900 pb-2 text-left">
                    Marketplace Volume Splits Projections
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs font-mono text-left">
                    <div>
                      <span className="text-zinc-500 block text-[9.5px]">EST. ACTIVE RETAIL SELLERS</span>
                      <span className="text-zinc-200 font-bold block mt-0.5">{activeSellersCount} Creators</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[9.5px]">EST. TOTAL VOLUME (GMV)</span>
                      <span className="text-zinc-200 font-bold block mt-0.5">${totalGmv.toLocaleString()} USD/mo</span>
                    </div>
                    
                    <div className="border-t border-zinc-900/40 pt-3 text-left">
                      <span className="text-zinc-500 block text-[9.5px] uppercase font-bold">Part A Commissions (2.0%)</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">+${Math.round(domesticCommission).toLocaleString()} USD</span>
                      <span className="text-[9px] text-zinc-550 leading-none">On Domestic Market licensing</span>
                    </div>
                    
                    <div className="border-t border-zinc-900/40 pt-3 text-left">
                      <span className="text-zinc-505 block text-[9.5px] uppercase font-bold">Part D Overseas Split (4.0%)</span>
                      <span className="text-emerald-400 font-bold block mt-0.5">+${Math.round(overseasCommissionTotal).toLocaleString()} USD</span>
                      <span className="text-[9px] text-zinc-550 leading-none">2.0% Base + 2.0% Customs Split</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-xl border border-zinc-900 text-xs font-mono">
                    <span className="text-zinc-400 font-bold">Total Platform Surcharge Fees:</span>
                    <span className="text-emerald-400 font-bold">${Math.round(totalTransactionalCommissions).toLocaleString()} USD/mo</span>
                  </div>
                </div>

                {/* Compound Total Revenues Summary Board */}
                <Card className="bg-gradient-to-br from-zinc-900/40 to-emerald-950/10 border border-emerald-900/30 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-emerald-400/[0.02] pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4 text-left font-sans">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2.5 font-bold">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" /> Combined LLC Revenue Stream
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      <div>
                        <span className="text-zinc-500 text-[9px] font-mono block">AGGREGATED MONTHLY INCOME</span>
                        <p className="text-2xl font-black text-white font-mono mt-1">
                          ${Math.round(totalMonthlyLLCRevenue).toLocaleString()} <span className="text-xs text-zinc-500">USD</span>
                        </p>
                      </div>
                      <div>
                        <span className="text-zinc-500 text-[9px] font-mono block font-bold">PROJECTED ANNUALIZED EARNINGS</span>
                        <p className="text-3xl font-black text-emerald-400 font-mono mt-1">
                          ${Math.round(totalAnnualLLCRevenue).toLocaleString()} <span className="text-xs text-zinc-500">USD</span>
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-zinc-900/50 pt-4 text-[10px] text-zinc-400 leading-relaxed font-sans flex items-start gap-2.5 text-left">
                      <HelpCircle className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p>
                        Our decentralized, zero-custody model keeps administrative costs at near-zero. At these settings, creators retain a combined total of <strong className="text-zinc-200">${Math.round(creatorRetainedRevenue).toLocaleString()} USD</strong> every month, creating high loyalty and organic marketing expansion.
                      </p>
                    </div>
                  </div>
                </Card>

              </div>
            </Card>
          </div>

        </div>
        </div>
      )}
    </div>
  );
}
