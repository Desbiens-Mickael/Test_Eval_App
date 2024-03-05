"use client";

import FileInput from "./components/file-input";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-9xl">Hello world !!</h1>
        <FileInput />
      </div>
    </main>
  );
}
