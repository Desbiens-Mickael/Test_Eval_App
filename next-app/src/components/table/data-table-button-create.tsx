"use client"

import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

interface DataTAbleBUttonCreateProps{
  createLink: string;
}

export default function DataTAbleBUttonCreate({createLink}: DataTAbleBUttonCreateProps)  {
  return (
    <Button
    size="sm"
    asChild className="ml-auto hidden h-8 lg:flex"
    >
      <Link href={createLink}>
        <Plus/>
      </Link>
    </Button>
  );
}