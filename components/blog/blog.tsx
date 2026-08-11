import { JSONContent } from "@tiptap/react"

interface BlogProps{
    title:string,
    content:JSONContent,
}
export default function blog({title,content}:BlogProps) {
    return (
        <div className="border-2 w-[65vw] rounded-2xl p-2">
            <h1 className="text-2xl font-bold">{title}</h1>
        </div>
    )
}
