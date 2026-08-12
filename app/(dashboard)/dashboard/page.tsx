import { headers } from "next/headers";

export default async function Page() {

  const res = await fetch("http://localhost:3000/api/dashboard", {
    headers: {
      cookie: (await headers()).get("cookie") ?? "",
    }
  });
  const data = await res.json();
  console.log(data)

  return (
    <div className="min-h-screen flex flex-col items-center gap-5 p-6">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="bg-slate-100 border-2 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-slate-700">Total blogs</div>
          <div className="text-2xl font-bold mt-1">{data.total}</div>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-amber-800">Drafts</div>
          <div className="text-2xl font-bold mt-1">{data.draft}</div>
        </div>
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-emerald-800">Public</div>
          <div className="text-2xl font-bold mt-1">{data.public}</div>
        </div>
        <div className="bg-purple-50 border-2 border-purple-200 rounded-md p-4 min-w-35 text-center">
          <div className="font-semibold text-purple-800">Private</div>
          <div className="text-2xl font-bold mt-1">{data.private}</div>
        </div>
      </div>
    </div>
  );
}
