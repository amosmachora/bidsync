"use client";

import { Chat } from "@/components/Chat";
import { MyItems } from "@/components/MyItems";
import { Navbar } from "@/components/Navbar";
import { Stage } from "@/components/Stage";
import UserProfileData from "@/components/UserProfileData";
import { Id } from "@/convex/_generated/dataModel";
import { GlobalDataProvider, useGlobalData } from "@/hooks/useGlobalData";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export default function Home() {
  return (
    <main className="flex flex-col relative h-screen">
      <Navbar />
      <GlobalDataProvider>
        <div className="flex flex-grow show">
          <Chat />
          <Stage />
          <MyItems />
        </div>
        <UserProfileData />
      </GlobalDataProvider>
    </main>
  );
}
