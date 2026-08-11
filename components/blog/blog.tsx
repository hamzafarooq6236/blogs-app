import { JSONContent } from "@tiptap/react"
import { Pencil } from 'lucide-react';
import Link from "next/link";

interface BlogProps{
    title:string,
    content:JSONContent,
    slug:string
}
export default function blog({title,content,slug}:BlogProps) {
    return (
        <div className="flex items-center border-2 w-[65vw] rounded-2xl p-2">
            <Link href={`/blogs/${slug}`}>{title}</Link>
            <Pencil className="text-black ml-auto h-4 "/>
        </div>
    )
}
