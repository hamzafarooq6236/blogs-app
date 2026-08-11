'use client'

import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import MenuBar from './menu-bar'

interface BlogContent {
    content?: JSONContent;
    mode: "edit" | "view";
    onChange?: (content: JSONContent) => void;
}
export default function Tiptap({ onChange ,mode,content}: BlogContent) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content ?? "",
        immediatelyRender: false,

        editorProps: {
            attributes: {
                class: "bg-slate-100 min-h-[65vh] border rounded-md py-2 px-3 focus:outline-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:font-['Arial',sans-serif] [&_h1]:my-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_p]:my-2"
            }
        },
        editable: mode === "edit",

        onUpdate: ({ editor }) => {
            if (mode === "edit") {
                onChange?.(editor.getJSON());
            }
        },
    })

    return (
        <div className="flex flex-col gap-2">
            {mode === "edit" && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    )
}
