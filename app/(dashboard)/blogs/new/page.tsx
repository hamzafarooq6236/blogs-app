import Tiptap from "@/components/editor/tiptap";
import { Button } from "@/components/ui/button";

export default function NewBlogPage() {
    return (
        <div className=" flex flex-col w-[70vw] mx-auto p-1">
            <div className="flex gap-2 justify-end flex-wrap">
                <Button>Publish</Button>
                <Button variant="outline">Save Draft</Button>
                <Button variant="destructive">Discard</Button>
            </div>
            {/* <div className="bg-blue-300 flex gap-2 justify-end flex-wrap">
                <Button></Button>
                <Button></Button>
                <Button></Button>
                <Button></Button>
                <Button></Button>
                <Button></Button>
            </div> */}
            <div className="">
                <Tiptap />
            </div>
        </div>
    )
}