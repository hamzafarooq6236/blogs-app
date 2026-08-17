import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, Shield, Zap, Edit3, LayoutDashboard, CheckCircle2 } from "lucide-react";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#E3FDFD] text-slate-800 flex flex-col selection:bg-[#71C9CE] selection:text-white font-sans">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#CBF1F5] rounded-full blur-3xl opacity-60"></div>
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-40"></div>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#E3FDFD]/80 border-b border-[#A6E3E9]/40">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-800 hover:text-[#71C9CE] transition-colors">
            <div className="p-2.5 bg-[#CBF1F5] rounded-xl text-[#71C9CE]">
              <BookOpen className="w-5 h-5" />
            </div>
            <span>BlogsApp</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/public/blogs"
              className="text-sm font-medium text-slate-600 hover:text-[#71C9CE] transition-colors"
            >
              Public Blogs
            </Link>
            {session?.user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl transition-all shadow-sm shadow-[#71C9CE]/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm font-medium text-slate-600 hover:text-[#71C9CE] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-xl shadow-md shadow-[#71C9CE]/20 transition-all transform hover:-translate-y-0.5"
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
        <section className="max-w-4xl mx-auto px-6 pt-32 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#CBF1F5]/60 border border-[#A6E3E9] text-[#71C9CE] text-xs font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Minimalist Blogging Experience</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 leading-tight mb-8">
            Focus on writing. <br />
            <span className="text-[#71C9CE]">
              Leave the rest to us.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed font-light">
            A beautiful, distraction-free blogging platform designed to help you share your thoughts with the world in style.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {session?.user ? (
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-2xl shadow-lg shadow-[#71C9CE]/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                Open Dashboard
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signup"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-[#71C9CE] hover:bg-[#5bb8bd] text-white rounded-2xl shadow-lg shadow-[#71C9CE]/20 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  Start Writing for Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/auth/signin"
                  className="w-full sm:w-auto px-8 py-4 text-base font-semibold bg-white hover:bg-[#CBF1F5]/30 text-slate-800 border border-[#A6E3E9] rounded-2xl transition-all flex items-center justify-center"
                >
                  Sign In to Account
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Feature Cards Grid */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 bg-white/70 border border-[#CBF1F5] rounded-3xl hover:border-[#A6E3E9] hover:bg-white transition-all backdrop-blur-md hover:shadow-xl hover:shadow-[#A6E3E9]/20 group">
              <div className="w-14 h-14 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE] group-hover:scale-110 group-hover:bg-[#A6E3E9] group-hover:text-white transition-all duration-300">
                <Edit3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Distraction-Free Editor</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                A clean, intuitive rich-text editor that gets out of your way and lets your ideas flow naturally.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 bg-white/70 border border-[#CBF1F5] rounded-3xl hover:border-[#A6E3E9] hover:bg-white transition-all backdrop-blur-md hover:shadow-xl hover:shadow-[#A6E3E9]/20 group">
              <div className="w-14 h-14 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE] group-hover:scale-110 group-hover:bg-[#A6E3E9] group-hover:text-white transition-all duration-300">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Seamless Publishing</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Keep your drafts private until they are perfect, then publish them to the world with a single click.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 bg-white/70 border border-[#CBF1F5] rounded-3xl hover:border-[#A6E3E9] hover:bg-white transition-all backdrop-blur-md hover:shadow-xl hover:shadow-[#A6E3E9]/20 group">
              <div className="w-14 h-14 bg-[#CBF1F5] rounded-2xl flex items-center justify-center mb-6 text-[#71C9CE] group-hover:scale-110 group-hover:bg-[#A6E3E9] group-hover:text-white transition-all duration-300">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Optimized for speed and performance, ensuring your readers have the best possible experience.
              </p>
            </div>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="max-w-5xl mx-auto px-6 py-20 mb-10">
          <div className="bg-[#CBF1F5]/50 border border-[#A6E3E9]/60 rounded-[2.5rem] p-10 sm:p-14 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm shadow-[#A6E3E9]/10">
            <div className="space-y-4 max-w-xl">
              <h3 className="text-3xl font-bold text-slate-800">Everything you need, nothing you don't</h3>
              <ul className="space-y-3 text-slate-700 mt-6">
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-[#A6E3E9] rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  Google OAuth & Passwordless Sign-in
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-[#A6E3E9] rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  Beautiful, minimalist dashboard
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-1 bg-[#A6E3E9] rounded-full">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  Custom slugs & SEO friendly URLs
                </li>
              </ul>
            </div>
            <Link
              href={session?.user ? "/dashboard" : "/auth/signup"}
              className="px-8 py-4 bg-white hover:bg-[#71C9CE] text-[#71C9CE] hover:text-white font-bold rounded-2xl transition-all shadow-lg shadow-[#A6E3E9]/30 text-lg shrink-0 transform hover:-translate-y-1"
            >
              {session?.user ? "Go to Dashboard" : "Get Started Now"}
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#A6E3E9]/40 py-10 bg-[#E3FDFD] text-slate-500 text-sm">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-medium">© {new Date().getFullYear()} BlogsApp. Crafted with minimalism.</p>
          <div className="flex gap-8 text-sm font-medium">
            <Link href="/auth/signin" className="hover:text-[#71C9CE] transition-colors">
              Sign In
            </Link>
            <Link href="/auth/signup" className="hover:text-[#71C9CE] transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
