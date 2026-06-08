'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export default function WalletConnect({ onConnect }: { onConnect: (address: string) => void }) {
  const [address, setAddress] = useState<string | null>(null);

  const connect = async () => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
        onConnect(userAddress);
      } catch (error) {
        console.error("Connection failed", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Button 
      onClick={connect} 
      className={address ? "bg-emerald-600 hover:bg-emerald-700" : "bg-white text-black hover:bg-zinc-200"}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {address ? `${address.substring(0, 6)}...${address.substring(38)}` : 'Connect Wallet'}
    </Button>
  );
}
