'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import MenuBar from './menu-bar'

const Tiptap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '<p>Hello World! 🌎️</p>',
        immediatelyRender:false,

        editorProps: {
            attributes: {
                class: "bg-blue-300 min-h-[65vh] border rounded-md py-2 px-3 m-2"
            }
        }

    })

    return (
        <div>
            <MenuBar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

export default Tiptap