import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold text-zinc-100">404 - Page Not Found</h1>
      <p className="mt-4 text-zinc-400">The page you are looking for does not exist.</p>
      <Link href="/" className="mt-8 px-4 py-2 bg-cyan-900 text-white rounded-lg hover:bg-cyan-800">
        Return Home
      </Link>
    </div>
  );
}
