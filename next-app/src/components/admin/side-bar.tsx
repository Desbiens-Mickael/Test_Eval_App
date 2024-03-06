"use client";

import UserItem from "../user-item";

export default function SideBar() {
  return (
    <div className="fixed flex flex-col bg-primary p-4 w-[300px] min-w-[300px] min-h-screen">
      <UserItem title="Mélinda Desbiens" description="desbiens.melinda@gmail.com" />
      <div className="grow py-4 text-primary-foreground">Menu</div>
      <div className="text-primary-foreground">Settings / Notifications</div>
    </div>
  );
}
