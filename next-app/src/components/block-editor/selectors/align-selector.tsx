import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SelectorItem } from "./node-selector";

export const AlignSelector = () => {
  const { editor } = useEditor();

  if (!editor) return null;
  const items: SelectorItem[] = [
    {
      name: "left",
      isActive: (editor) => (editor ? editor.isActive({ textAlign: "left" }) : false),
      command: (editor) => editor?.chain().focus().setTextAlign("left").run(),
      icon: AlignLeft,
    },
    {
      name: "center",
      isActive: (editor) => (editor ? editor.isActive({ textAlign: "center" }) : false),
      command: (editor) => editor?.chain().focus().setTextAlign("center").run(),
      icon: AlignCenter,
    },
    {
      name: "right",
      isActive: (editor) => (editor ? editor.isActive({ textAlign: "right" }) : false),
      command: (editor) => editor?.chain().focus().setTextAlign("right").run(),
      icon: AlignRight,
    },
    {
      name: "justify",
      isActive: (editor) => (editor ? editor.isActive({ textAlign: "justify" }) : false),
      command: (editor) => editor?.chain().focus().setTextAlign("justify").run(),
      icon: AlignJustify,
    },
  ];

  return (
    <div className="flex">
      {items.map((item) => (
        <EditorBubbleItem
          key={item.name}
          onSelect={(editor) => {
            item.command(editor);
          }}
        >
          <Button type="button" size="sm" className="rounded-none" variant="ghost">
            <item.icon
              className={cn("h-4 w-4", {
                "text-blue-500": item.isActive(editor),
              })}
            />
          </Button>
        </EditorBubbleItem>
      ))}
    </div>
  );
};
