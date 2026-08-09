'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    ethereum: any;
  }
}

export default function WalletButton() {
  const [account, setAccount] = useState<string | null>(null);

  const connectWallet = async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("User rejected request:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <Button onClick={connectWallet} variant="outline" className="rounded-full">
      {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Connect Wallet"}
    </Button>
  );
}
