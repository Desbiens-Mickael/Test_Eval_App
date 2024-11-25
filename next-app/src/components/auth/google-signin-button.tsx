"use client";

import signInAction from "@/actions/signIn.action";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface GoogleSIgninButtonProps {
  className?: string;
}

export default function GoogleSIgnInButton({ className }: GoogleSIgninButtonProps) {
  return (
    <Button className={cn("w-full bg-slate-50 border shadow hover:bg-slate-100", className)} onClick={() => signInAction("google")}>
      <Image src={"/assets/images/google.svg"} width={80} height={30} alt="icone google" className="w-[85px] h-auto" />
    </Button>
  );
}
