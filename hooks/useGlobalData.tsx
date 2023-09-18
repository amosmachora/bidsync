"use client";

import { Id } from "@/convex/_generated/dataModel";
import React from "react";
import { createContext, useContext, useState } from "react";

type GlobalData = {
  setUserProfileId: React.Dispatch<React.SetStateAction<Id<"users"> | null>>;
  userProfileId: Id<"users"> | null;
  isShowingAddBidItemModal: boolean;
  setIsShowingAddBidItemModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const globalDataContext = createContext<GlobalData>({
  setUserProfileId: () => {},
  userProfileId: null,
  isShowingAddBidItemModal: false,
  setIsShowingAddBidItemModal: () => {},
});

export const GlobalDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userProfileId, setUserProfileId] = useState<null | Id<"users">>(null);
  const [isShowingAddBidItemModal, setIsShowingAddBidItemModal] =
    useState(false);

  return (
    <globalDataContext.Provider
      value={{
        userProfileId,
        setUserProfileId,
        isShowingAddBidItemModal,
        setIsShowingAddBidItemModal,
      }}
    >
      {children}
    </globalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(globalDataContext);
