"use client";

import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { createContext, useContext, useState } from "react";

type GlobalData = {
  setUserProfileId: React.Dispatch<React.SetStateAction<Id<"users"> | null>>;
  userProfileId: Id<"users"> | null;
};

export const globalDataContext = createContext<GlobalData>({
  setUserProfileId: () => {},
  userProfileId: null,
});

export const GlobalDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userProfileId, setUserProfileId] = useState<null | Id<"users">>(null);

  console.log(userProfileId);
  return (
    <globalDataContext.Provider
      value={{
        userProfileId,
        setUserProfileId,
      }}
    >
      {children}
    </globalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(globalDataContext);
