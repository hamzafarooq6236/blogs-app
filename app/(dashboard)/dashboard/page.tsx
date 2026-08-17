import { getDashboardStatsAction } from "@/actions/blogs";
import { BookOpen, FileText, Globe, Lock } from "lucide-react";

export default async function Page() {
  const result = await getDashboardStatsAction();
  const data = result.stats || { total: 0, draft: 0, public: 0, private: 0 };

  return (
    <div className="min-h-[calc(100vh-3rem)] w-full relative overflow-hidden font-sans p-6 sm:p-10">
      {/* Subtle Background Elements matching landing page */}
      {/* <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#baf6fc] rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div> */}
      <div className="absolute -bottom-30 -right-40 w-96 h-96 bg-[#A6E3E9] rounded-full blur-3xl opacity-60 pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Here's what's happening with your blogs.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Blogs Card */}
          <div className="bg-white/60 border border-[#CBF1F5] rounded-3xl p-6 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl hover:shadow-md hover:shadow-[#A6E3E9]/30 transition-all flex items-center gap-5 group">
            <div className="w-14 h-14 bg-[#CBF1F5] rounded-2xl flex items-center justify-center text-[#71C9CE] shrink-0 group-hover:scale-110 group-hover:bg-[#A6E3E9] group-hover:text-white transition-all duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Total Blogs</div>
              <div className="text-3xl font-bold text-slate-800 mt-0.5">{data.total}</div>
            </div>
          </div>

          {/* Drafts Card */}
          <div className="bg-white/60 border border-[#CBF1F5] rounded-3xl p-6 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl hover:shadow-md hover:shadow-[#A6E3E9]/30 transition-all flex items-center gap-5 group">
            <div className="w-14 h-14 bg-[#CBF1F5]/50 text-[#71C9CE] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#CBF1F5] transition-all duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Drafts</div>
              <div className="text-3xl font-bold text-slate-800 mt-0.5">{data.draft}</div>
            </div>
          </div>

          {/* Public Card */}
          <div className="bg-white/60 border border-[#CBF1F5] rounded-3xl p-6 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl hover:shadow-md hover:shadow-[#A6E3E9]/30 transition-all flex items-center gap-5 group">
            <div className="w-14 h-14 bg-[#A6E3E9]/40 text-[#5bb8bd] rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#A6E3E9] group-hover:text-white transition-all duration-300">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Public</div>
              <div className="text-3xl font-bold text-slate-800 mt-0.5">{data.public}</div>
            </div>
          </div>

          {/* Private Card */}
          <div className="bg-white/60 border border-[#CBF1F5] rounded-3xl p-6 shadow-sm shadow-[#A6E3E9]/10 backdrop-blur-xl hover:shadow-md hover:shadow-[#A6E3E9]/30 transition-all flex items-center gap-5 group">
            <div className="w-14 h-14 bg-[#E3FDFD] text-[#71C9CE] rounded-2xl flex items-center justify-center border border-[#CBF1F5] shrink-0 group-hover:scale-110 group-hover:bg-[#CBF1F5] transition-all duration-300">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Private</div>
              <div className="text-3xl font-bold text-slate-800 mt-0.5">{data.private}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
