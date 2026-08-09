import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col items-center justify-center p-6 text-center space-y-4">
      <h2 className="text-3xl font-bold text-white">404 - Page Not Found</h2>
      <p className="text-sm text-zinc-400 font-medium">The requested resource could not be found.</p>
      <Link 
        href="/" 
        className="inline-flex items-center justify-center px-4 py-2 text-xs font-bold bg-cyan-500 text-black hover:bg-cyan-400 rounded-full transition-colors"
      >
        Return to Sovranly IP Home
      </Link>
    </div>
  );
}
