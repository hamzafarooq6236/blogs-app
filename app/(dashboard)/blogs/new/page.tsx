"use client"
import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewBlogPage() {
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);

    async function saveDraft(e:React.MouseEvent<HTMLButtonElement>){
        console.log(title);
        console.log(content);

        const res = await fetch("/api/blogs/new",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({title,content,status:"draft"}),
        })
        console.log(await res.json());
        

        if(res.ok){
            router.push("/dashboard");
        }


    }
    return (
        <div className=" flex flex-col gap-2 w-[70vw] mx-auto p-3">
            <div className="flex gap-2 justify-end flex-wrap">
                <Button>Publish</Button>
                <Button variant="outline" onClick={saveDraft}>Save Draft</Button>
                <Button variant="destructive">Discard</Button>
            </div>
            <div>
                <strong className="text-2xl font-['Arial',sans-serif]">
                    Add New Post
                </strong>
                <input className="w-full border-2 border-slate-50 p-2" type="text" placeholder="Enter title here" required autoFocus onChange={(e) => { setTitle(e.target.value) }} />
            </div>
            <div className="">
                <Tiptap onChange={(json) => {
                    setContent(json);
                }} />
            </div>
        </div>
    )
}