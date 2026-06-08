export default function WikiPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans p-16">
      <h1 className="text-4xl font-extrabold mb-8">Sovranly IP FAQ / Wiki</h1>
      <div className="space-y-6">
        <div className="p-6 bg-zinc-900 rounded-lg">
          <h2 className="font-bold">What is Sovranly IP?</h2>
          <p className="text-zinc-500">Sovranly IP is a blockchain-native platform...</p>
        </div>
        <div className="p-6 bg-zinc-900 rounded-lg">
          <h2 className="font-bold">How do I deploy an asset?</h2>
          <p className="text-zinc-500">Connect your wallet and use the factory...</p>
        </div>
      </div>
    </div>
  );
}
