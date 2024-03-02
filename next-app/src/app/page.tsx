"use client";

import FileInput from "./components/file-input";
import { createUser, fetchUser } from "./test";

export default function Home() {
  const createUserWithApiRoute = async () => {
    const data = { name: "test", email: "test5@gmail.com" };

    const res = await fetch("http://localhost:3000/api/users", {
      next: { revalidate: false },
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    console.log(await res.json());
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="flex flex-col items-center gap-10">
        <h1 className="text-9xl">Hello world !!</h1>
        <div className="flex justify-between w-full mb-10">
          <button onClick={() => createUser()}>Create user</button>
          <button onClick={() => fetchUser()}>Fetch user</button>
          <button onClick={() => createUserWithApiRoute()}>Fetch user with api route</button>
        </div>
        <FileInput />
      </div>
    </main>
  );
}
