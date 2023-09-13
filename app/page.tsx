"use client";

import { Chat } from "@/components/Chat";
import { MyItems } from "@/components/MyItems";
import { Navbar } from "@/components/Navbar";
import { Stage } from "@/components/Stage";
import UserProfileData from "@/components/UserProfileData";
import { Id } from "@/convex/_generated/dataModel";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export const globalContext = createContext<{
  setUserProfileId: Dispatch<SetStateAction<Id<"users"> | null>> | null;
}>({ setUserProfileId: null });

export default function Home() {
  const [userProfileId, setUserProfileId] = useState<null | Id<"users">>(null);
  return (
    <main className="flex flex-col relative h-screen">
      <Navbar />
      <globalContext.Provider value={{ setUserProfileId }}>
        <div className="flex flex-grow show">
          <Chat />
          <Stage />
          <MyItems />
        </div>
      </globalContext.Provider>
      {userProfileId && (
        <UserProfileData
          userId={userProfileId}
          close={() => setUserProfileId(null)}
        />
      )}
    </main>
  );
}
