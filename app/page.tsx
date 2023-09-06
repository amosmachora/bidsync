"use client";

import { Chat } from "@/components/Chat";
import { MyItems } from "@/components/MyItems";
import { Navbar } from "@/components/Navbar";
import { Stage } from "@/components/Stage";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col relative h-screen">
      <Navbar />
      <div className="flex flex-grow">
        <div className="w-3/4 show">
          <Stage />
          <Chat />
        </div>
        <MyItems />
      </div>
    </main>
  );
}
