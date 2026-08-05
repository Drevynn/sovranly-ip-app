import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-3xl font-bold text-white">404 - Page Not Found</h2>
      <p className="text-sm text-zinc-400 font-medium">The requested resource could not be found.</p>
      <Button asChild variant="outline" size="sm">
        <Link href="/">Return to Sovranly IP Home</Link>
      </Button>
    </div>
  );
}
