import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link2, List, ListOrdered, Redo2, RemoveFormatting, Undo2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type Props = {
    value: string;
    onChange: (html: string) => void;
    className?: string;
    placeholder?: string;
};

export function RichTextEditor({ value, onChange, className, placeholder }: Props) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                protocols: ['http', 'https', 'mailto'],
            }),
        ],
        content: value || '<p></p>',
        editorProps: {
            attributes: {
                class: 'tiptap min-h-[180px] px-3 py-2 text-sm text-pf-text dark:text-pf-text-dark focus:outline-none',
            },
        },
        onUpdate: ({ editor: activeEditor }) => {
            onChange(activeEditor.getHTML());
        },
    });

    useEffect(() => {
        if (!editor) {
            return;
        }

        const current = editor.getHTML();

        if (value !== current) {
            editor.commands.setContent(value || '<p></p>', { emitUpdate: false });
        }
    }, [editor, value]);

    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href as string | undefined;
        const url = window.prompt('URL de l\'enllac', previousUrl || 'https://');

        if (url === null) {
            return;
        }

        if (url.trim() === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className={cn('overflow-hidden rounded-xl border border-input bg-transparent', className)}>
            <div className="flex flex-wrap items-center gap-1 border-b border-input bg-muted/30 p-2 dark:bg-input/20">
                <Button
                    type="button"
                    variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('bulletList') ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('orderedList') ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant={editor.isActive('link') ? 'secondary' : 'ghost'}
                    size="icon-sm"
                    onClick={setLink}
                >
                    <Link2 className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
                >
                    <RemoveFormatting className="h-4 w-4" />
                </Button>
                <div className="ml-auto flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().chain().focus().undo().run()}
                    >
                        <Undo2 className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().chain().focus().redo().run()}
                    >
                        <Redo2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <EditorContent editor={editor} />

            {placeholder && editor.isEmpty && (
                <div className="pointer-events-none -mt-8.5 px-3 py-2 text-sm text-pf-text-3 dark:text-pf-text-3dark">
                    {placeholder}
                </div>
            )}
        </div>
    );
}