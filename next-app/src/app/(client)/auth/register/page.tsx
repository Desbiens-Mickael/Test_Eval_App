"use client";

import FormRegister from "@/components/auth/form-register";

export default function RegisterPage() {
  return (
    <div className="container relative overflow-hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-[90%] lg:grid-cols-2 lg:px-0 bg-background rounded-lg border shadow-md">
      <div className="h-full w-full bg-zinc-900"></div>
      <div className="h-full w-full flex flex-col justify-center items-center">
        <FormRegister />
      </div>
    </div>
  );
}
