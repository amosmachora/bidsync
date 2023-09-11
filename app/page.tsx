"use client";

import { Chat } from "@/components/Chat";
import { MyItems } from "@/components/MyItems";
import { Navbar } from "@/components/Navbar";
import { Stage } from "@/components/Stage";

export default function Home() {
  return (
    <main className="flex flex-col relative h-screen">
      <Navbar />
      <div className="flex flex-grow show">
        <Chat />
        <Stage />
        <MyItems />
      </div>
    </main>
  );
}
