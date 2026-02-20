import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="z-10 text-center max-w-2xl animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium mb-6">
          <span className="pulse-dot bg-blue-400" />
          AI-Powered Client Onboarding
        </div>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 mt-2">
          Automate your <br className="hidden md:block" />
          <span className="gradient-text">Client Analysis</span>
        </h1>

        <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto leading-relaxed">
          Upload onboarding forms. Our AI business consultant reads, assesses, and generates tailored recommendations instantly — replacing hours of manual work.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login" className="btn-primary w-full sm:w-auto text-base px-8 py-3">
            Sign In
          </Link>
          <Link href="/register" className="btn-secondary w-full sm:w-auto text-base px-8 py-3">
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
