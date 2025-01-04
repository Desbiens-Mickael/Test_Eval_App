"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FolderKanban, MoreHorizontal, Users } from "lucide-react";
import { useRouter } from "next/navigation";

interface users {
  id: string;
  name: string;
}

interface GroupCardProps {
  id: string;
  name: string;
  users: users[];
}

export default function GroupCard({ id, name, users }: GroupCardProps) {
  const router = useRouter();
  return (
    <Card
      className="w-full lg:w-[280px] 
        bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md overflow-hidden"
    >
      <CardHeader
        className="bg-gradient-to-r from-gray-100 to-gray-200 
        dark:from-gray-700 dark:to-gray-600
        p-4 
        flex flex-row items-center 
        justify-between"
      >
        <CardTitle className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          <FolderKanban className="w-6 h-6 text-primary" />
          {name}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0"
              aria-label="Options menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => {
                router.push(`/admin/groupes/${id}`);
              }}
            >
              voir
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-primary hover:bg-orange-200 hover:text-primary focus:bg-orange-200 focus:text-primary">
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-destructive hover:bg-red-200 hover:text-destructive focus:bg-red-200 focus:text-destructive">
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-4 flex items-center justify-between ">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          {users.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              Aucun utilisateur
            </p>
          ) : (
            <p className="font-semibold text-gray-700 dark:text-gray-200">
              {`${users.length} ${
                users.length > 1 ? "apprenants" : "apprenant"
              }`}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
