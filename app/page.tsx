import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Shield, Zap, Edit3, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Background Gradient Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-950/70 border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              BlogsApp
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 z-10">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-6 pt-24 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-medium mb-6 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-gen Blogging Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight sm:leading-none mb-6">
            Write your thoughts. <br />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Share with the world.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            A fast, modern blogging platform built with Next.js, Tiptap rich-text editing, and seamless cloud data management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Start Writing for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 rounded-2xl transition-all flex items-center justify-center"
                >
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-slate-700/80 transition-all backdrop-blur-sm group">
              <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Rich Editor</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Powered by Tiptap rich-text engine with full formatting, heading controls, alignments, and intuitive styling.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-slate-700/80 transition-all backdrop-blur-sm group">
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Draft & Publish Controls</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Toggle between private drafts and public posts with ease. Keep your ideas safe until you are ready to publish.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-slate-900/60 border border-slate-800/80 rounded-2xl hover:border-slate-700/80 transition-all backdrop-blur-sm group">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Built with Next.js App Router and PostgreSQL for ultra-fast page rendering and instant server-side data fetching.
              </p>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="max-w-4xl mx-auto px-6 py-12 mb-16">
          <div className="bg-gradient-to-r from-slate-900/90 to-indigo-950/40 border border-slate-800 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white">Everything you need to write</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Google OAuth & Passwordless Sign-in
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Instant stats dashboard for all your posts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Custom slugs & SEO friendly URLs
                </li>
              </ul>
            </div>
            <Link
              href={session?.user ? "/dashboard" : "/auth/signup"}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-slate-950 font-semibold rounded-xl transition-all text-sm shrink-0"
            >
              {session?.user ? "Go to Dashboard" : "Get Started Now"}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-8 bg-slate-950/90 text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} BlogsApp. All rights reserved.</p>
          <div className="flex gap-6 text-xs">
            <Link href="/auth/signin" className="hover:text-slate-300 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-slate-300 transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
