'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent, JSONContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Image } from '@tiptap/extension-image'
import MenuBar from './menu-bar'

interface BlogContent {
    content?: JSONContent | null;
    mode: "edit" | "view";
    onChange?: (content: JSONContent) => void;
}
export default function Tiptap({ onChange, mode, content }: BlogContent) {
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
            Image.configure({
                allowBase64: true,
                resize: mode === "edit" ? {
                    enabled: true,
                    minWidth: 50,
                    minHeight: 50,
                } : false,
            }),
        ],

        content: content ?? "",
        immediatelyRender: false,

        editorProps: {
            attributes: {
                class: `focus:outline-none font-sans text-slate-700 text-lg leading-relaxed [&_h1]:text-4xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mb-6 [&_h1]:mt-8 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mb-4 [&_h2]:mt-6 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mb-3 [&_h3]:mt-5 [&_p]:my-4 [&_a]:text-[#71C9CE] [&_strong]:font-bold [&_strong]:text-slate-900 ${mode === "edit" ? "bg-white min-h-[65vh] border border-[#A6E3E9] rounded-2xl p-6 focus:ring-4 focus:ring-[#CBF1F5]/50 transition-all shadow-inner shadow-[#A6E3E9]/10" : ""}`
            }
        },
        editable: mode === "edit",

        onUpdate: ({ editor }) => {
            if (mode === "edit") {
                onChange?.(editor.getJSON());
            }
        },
    })

    useEffect(() => {
        if (editor && content) {
            const currentContent = JSON.stringify(editor.getJSON());
            const newContent = JSON.stringify(content);
            if (currentContent !== newContent) {
                editor.commands.setContent(content);
            }
        }
    }, [editor, content])

    return (
        <div className="flex flex-col gap-2">
            {mode === "edit" && <MenuBar editor={editor} />}
            <EditorContent editor={editor} />
        </div>
    )
}
