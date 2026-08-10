import { Editor, useEditorState } from "@tiptap/react"
import {
    Heading1,
    Heading2,
    Heading3,
    Pilcrow,
    Bold,
    Italic,
    Strikethrough,
    Highlighter,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from "lucide-react"

interface MenuBarProps {
    editor: Editor | null
}

export default function MenuBar({ editor }: MenuBarProps) {
    if (!editor) {
        return null
    }
    const editorState = useEditorState({
        editor,
        selector: ctx => {
            return {
                // Text formatting
                isBold: ctx.editor.isActive('bold') ?? false,
                isItalic: ctx.editor.isActive('italic') ?? false,
                isStrike: ctx.editor.isActive('strike') ?? false,
                isHighlight: ctx.editor.isActive('highlight') ?? false,

                // Text alignment
                isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }) ?? false,
                isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }) ?? false,
                isAlignRight: ctx.editor.isActive({ textAlign: 'right' }) ?? false,
                isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }) ?? false,

                // Block types
                isParagraph: ctx.editor.isActive('paragraph') ?? false,
                isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
                isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
                isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
            }
        },
    })

    const options = [
        {
            icon: Heading1,
            onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: editorState.isHeading1,
        },
        {
            icon: Heading2,
            onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editorState.isHeading2,
        },
        {
            icon: Heading3,
            onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editorState.isHeading3,
        },
        {
            icon: Pilcrow,
            
            onClick: () => editor.chain().focus().setParagraph().run(),
            isActive: editorState.isParagraph,
        },
        {
            icon: Bold,
            
            onClick: () => editor.chain().focus().toggleBold().run(),
            isActive: editorState.isBold,
        },
        {
            icon: Italic,
            
            onClick: () => editor.chain().focus().toggleItalic().run(),
            isActive: editorState.isItalic,
        },
        {
            icon: Strikethrough,
            
            onClick: () => editor.chain().focus().toggleStrike().run(),
            isActive: editorState.isStrike,
        },
        {
            icon: Highlighter,
            
            onClick: () => editor.chain().focus().toggleHighlight().run(),
            isActive: editorState.isHighlight,
        },
        {
            icon: AlignLeft,
            onClick: () => editor.chain().focus().setTextAlign("left").run(),
            isActive: editorState.isAlignLeft,
        },
        {
            icon: AlignCenter,
            onClick: () => editor.chain().focus().setTextAlign("center").run(),
            isActive: editorState.isAlignCenter,
        },
        {
            icon: AlignRight,
            onClick: () => editor.chain().focus().setTextAlign("right").run(),
            isActive: editorState.isAlignRight,
        },
        {
            icon: AlignJustify,
            onClick: () => editor.chain().focus().setTextAlign("justify").run(),
            isActive: editorState.isAlignJustify,
        },
    ]

    return (
        <div className="control-group">
            <div className="button-group flex flex-wrap gap-2 bg-blue-300 py-2 px-3 m-2 rounded-md">
                {options.map((option, index) => {
                    const IconComponent = option.icon
                    return (
                        <button
                            key={index}
                            onClick={option.onClick}
                            type="button"
                            className={`p-1.5 rounded transition-colors ${
                                option.isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white/80 hover:bg-white text-slate-800'
                            }`}
                        >
                            <IconComponent className="w-4 h-4" />
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
