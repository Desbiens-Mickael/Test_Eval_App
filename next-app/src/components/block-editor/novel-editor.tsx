"use client";

import { useState } from "react";

import { EditorCommand, EditorCommandEmpty, EditorCommandItem, EditorCommandList, EditorContent, EditorRoot, JSONContent } from "novel";

import { ImageResizer, handleCommandNavigation } from "novel/extensions";
import { handleImageDrop, handleImagePaste } from "novel/plugins";

import { Separator } from "@/components/ui/separator";
import EditorMenu from "./editor-menu";
import { defaultExtensions } from "./extentions/extentions";
import { uploadFn } from "./image-upload";
import { AlignSelector } from "./selectors/align-selector";
import { ColorSelector } from "./selectors/color-selector";
import { LinkSelector } from "./selectors/link-selector";
import { MathSelector } from "./selectors/math-selector";
import { NodeSelector } from "./selectors/node-selector";
import { TableSelector } from "./selectors/table-selector";
import { TextButtons } from "./selectors/text-buttons";
import { slashCommand, suggestionItems } from "./slash-command";

const hljs = require("highlight.js");

const extensions = [...defaultExtensions, slashCommand];

export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      content: [],
    },
  ],
};

interface EditorProps {
  initialValue?: JSONContent;
  editable?: boolean;
  onChange: (content: JSONContent) => void;
}

export default function Editor({ initialValue, onChange, editable=true }: EditorProps) {
  const [openAI, setOpenAI] = useState(false);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);
  const [openTable, setOpenTable] = useState(false);

  const stringToJSONContent = (content?: string): JSONContent | undefined => {
    if (!content) return undefined;
    return {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: content
            }
          ]
        }
      ]
    };
  };

  //Apply Codeblock Highlighting on the HTML from editor.getHTML()
  const highlightCodeblocks = (content: string) => {
    const doc = new DOMParser().parseFromString(content, "text/html");
    doc.querySelectorAll("pre code").forEach((el) => {
      // @ts-ignore
      // https://highlightjs.readthedocs.io/en/latest/api.html?highlight=highlightElement#highlightelement
      hljs.highlightElement(el);
    });
    return new XMLSerializer().serializeToString(doc);
  };

  return (
    <div className="relative w-full max-w-screen-xl">
      <EditorRoot>
        <EditorContent
          editable={editable}
          immediatelyRender={false}
          initialContent={initialValue}
          extensions={extensions}
          className="min-h-96 rounded-xl border p-4"
          editorProps={{
            handleDOMEvents: {
              keydown: (_view, event) => handleCommandNavigation(event),
            },
            handlePaste: (view, event) => handleImagePaste(view, event, uploadFn),
            handleDrop: (view, event, _slice, moved) => handleImageDrop(view, event, moved, uploadFn),
            attributes: {
              class: "prose dark:prose-invert prose-headings:font-title font-default focus:outline-none max-w-full min-h-96",
            },
          }}
          onUpdate={({ editor }) => {
            onChange(editor.getJSON());
          }}
          slotAfter={<ImageResizer />}
        >
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={(val) => item.command?.(val)}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">{item.icon}</div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>

          <EditorMenu open={openAI} onOpenChange={setOpenAI}>
            <div className="flex">
              <TextButtons />
              <MathSelector />

              <Separator orientation="vertical" className="h-auto" />
              <AlignSelector />
            </div>

            <div className="flex">
              <NodeSelector open={openNode} onOpenChange={setOpenNode} />

              <Separator orientation="vertical" className="h-auto" />
              <ColorSelector open={openColor} onOpenChange={setOpenColor} />

              <Separator orientation="vertical" className="h-auto" />
              <LinkSelector open={openLink} onOpenChange={setOpenLink} />

              <Separator orientation="vertical" className="h-auto" />
              <TableSelector open={openTable} onOpenChange={setOpenTable} />
            </div>
          </EditorMenu>
        </EditorContent>
      </EditorRoot>
    </div>
  );
}
