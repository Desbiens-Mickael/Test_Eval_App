import { ChevronDown, Columns2, Grid2X2, LucideGrid2x2X, Rows2, TableCellsMerge, TableProperties  } from "lucide-react";
import { EditorBubbleItem, useEditor } from "novel";
import { SelectorItem } from "./node-selector";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const itemsCreate: SelectorItem[] = [
    {
      name: "Ajouter une colonne",
      icon: Columns2,
      command: (editor) => editor?.chain().focus().addColumnAfter().run(),
      isActive: () =>  false,
    },
    {
      name: "Ajouter une ligne",
      icon: Rows2,
      command: (editor) => editor?.chain().focus().addRowAfter().run(),
      isActive: () =>  false,
    },
    {
      name: "Fusionner ou diviser les cellules",
      icon: TableCellsMerge,
      command: (editor) => editor?.chain().focus().mergeOrSplit().run(),
      isActive: () =>  false,
    },
]

const itemsDelete: SelectorItem[] = [
  {
    name: "Supprimer une colonne",
    icon: Columns2,
    command: (editor) => editor?.chain().focus().deleteColumn().run(),
    isActive: () =>  false,
  },
  {
    name: "Supprimer une ligne",
    icon: Rows2,
    command: (editor) => editor?.chain().focus().deleteRow().run(),
    isActive: () =>  false,
  },
  {
    name: "Supprimer la table",
    icon: LucideGrid2x2X,
    command: (editor) => editor?.chain().focus().deleteTable().run(),
    isActive: () =>  false,
  },
];

export const TableSelector = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
    const { editor } = useEditor();
    if (!editor) return null;
    
    return (
      <Popover modal={true} open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild className="gap-2 rounded-none border-none hover:bg-accent focus:ring-0">
          <Button size="sm" variant="ghost" className="gap-2">
            <span className="whitespace-nowrap text-sm"><TableProperties className="h-4 w-4" /></span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent sideOffset={5} align="start" className="w-48 p-1">
          {itemsCreate.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={(editor) => {
                item.command(editor);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border p-1">
                  <item.icon className="h-3 w-3" />
                </div>
                <span>{item.name}</span>
              </div>
            </EditorBubbleItem>
          ))}
          <Separator orientation="horizontal" className="my-2" />
          {itemsDelete.map((item) => (
            <EditorBubbleItem
              key={item.name}
              onSelect={(editor) => {
                item.command(editor);
                onOpenChange(false);
              }}
              className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent"
            >
              <div className="flex items-center space-x-2">
                <div className="rounded-sm border p-1">
                  <item.icon className="h-3 w-3" />
                </div>
                <span>{item.name}</span>
              </div>
            </EditorBubbleItem>
          ))}
        </PopoverContent>
      </Popover>
    );
  };