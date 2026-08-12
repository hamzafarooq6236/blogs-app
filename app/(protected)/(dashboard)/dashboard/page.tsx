"use client";
import { useEffect, useState } from "react";

interface DashboardStats {
  total: number;
  draft: number;
  public: number;
  private: number;
}

export default function Page() {
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    draft: 0,
    public: 0,
    private: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 p-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="bg-slate-100 border-2 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-slate-700">Total blogs</div>
          <div className="text-2xl font-bold mt-1">{loading ? "..." : stats.total}</div>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-amber-800">Drafts</div>
          <div className="text-2xl font-bold mt-1">{loading ? "..." : stats.draft}</div>
        </div>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-emerald-800">Public</div>
          <div className="text-2xl font-bold mt-1">{loading ? "..." : stats.public}</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-purple-800">Private</div>
          <div className="text-2xl font-bold mt-1">{loading ? "..." : stats.private}</div>
        </div>
      </div>
    </div>
  );
}
