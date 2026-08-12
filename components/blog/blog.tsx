import { JSONContent } from "@tiptap/react"
import { Pencil } from 'lucide-react';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BlogProps {
    title: string,
    // content: JSONContent,
    slug: string
    createdAt: string
    publishedAt: number | string | null
}
export default function blog({ title, slug, createdAt, publishedAt }: BlogProps) {
    const router = useRouter();
    
    return (
        <div className="flex flex-col w-[40vw] gap-1 border-2 rounded-2xl px-3 pt-3 pb-1">
            <div className="flex items-center ">
                <div className="flex-1 min-w-0">
                    <Link href={`/blogs/${slug}`} className=" hover:text-blue-400 hover:underline hover:underline-offset-3">
                        {title}
                    </Link>
                </div>

                <button
                    type="button"
                    className="shrink-0 ml-auto"
                    onClick={() => router.push(`/blogs/${slug}/edit`)}
                >
                    <Pencil className="h-4 w-4 cursor-pointer text-black" />
                </button>
            </div>
            <p className="text-black text-xs self-end">Created: {createdAt} Updated: {}</p>
        </div>
    )
}
