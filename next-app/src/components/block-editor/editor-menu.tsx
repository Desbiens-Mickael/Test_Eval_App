import { EditorBubble, useEditor } from "novel";
import { removeAIHighlight } from "novel/extensions";

import { type ReactNode, useEffect } from "react";

interface EditorMenuProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditorMenu({
  children,
  open,
  onOpenChange,
}: EditorMenuProps) {
  const { editor } = useEditor();

  useEffect(() => {
    if (!editor) return;
    if (!open) removeAIHighlight(editor);
  }, [open, editor]);

  return (
    <EditorBubble
      tippyOptions={{
        placement: open ? "bottom-start" : "top",
        maxWidth: "none",
        onHidden: () => {
          onOpenChange(false);
          editor?.chain().unsetHighlight().run();
        },
      }}
      className="flex flex-col w-fit overflow-hidden rounded-md border border-muted bg-background shadow-xl"
    >
      {!open && children}
    </EditorBubble>
  );
}
