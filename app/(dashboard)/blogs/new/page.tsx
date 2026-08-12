"use client"
import Tiptap from "@/components/editor/tiptap";
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button";
import { JSONContent } from "@tiptap/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function NewBlogPage() {
    const [enabled, setEnabled] = useState(false);
    const router = useRouter();
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<JSONContent | null>(null);

    async function save(status: string) {
        if (!title.trim()) {
            alert("Title is required!");
            return;
        }
        if (status === "publish") {
            if(enabled===true){
                status="public"
            }else{
                status="private"
            }

        }
        console.log(title);
        console.log(content);

        const res = await fetch("/api/blogs", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title, content, status }),
        })
        console.log(await res.json());


        if (res.ok) {
            router.push("/dashboard");
        }


    }
    return (
        <div className=" flex flex-col gap-2 w-[70vw] mx-auto p-3">
            <div className="flex gap-2 justify-end flex-wrap">
                <div className="flex items-center space-x-2 border-2 rounded-sm p-1">
                    <Switch className="cursor-pointer" id="airplane-mode" onCheckedChange={setEnabled} onClick={()=>setEnabled(!enabled)}/>
                    <Label htmlFor="airplane-mode">Public</Label>
                </div>
                <Button onClick={() => save("publish")}>Publish</Button>
                <Button variant="outline" onClick={() => save("draft")}>Save Draft</Button>
                <Button variant="destructive" onClick={() => router.push("/dashboard")}>Discard</Button>
            </div>
            <div>
                <strong className="text-2xl font-['Arial',sans-serif]">
                    Add New Post
                </strong>
                <input className="w-full border-2 border-slate-50 p-2" type="text" placeholder="Enter title here" required autoFocus onChange={(e) => { setTitle(e.target.value) }} />
            </div>
            <div className="">
                <Tiptap mode="edit" onChange={(json) => {
                    setContent(json);
                }} />
            </div>
        </div>
    )
}