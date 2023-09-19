"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";

type GlobalData = {
  setUserProfileId: React.Dispatch<React.SetStateAction<Id<"users"> | null>>;
  userProfileId: Id<"users"> | null;
  isShowingAddBidItemModal: boolean;
  setIsShowingAddBidItemModal: React.Dispatch<React.SetStateAction<boolean>>;
  onStageItem: {
    _id: Id<"stageitems">;
    _creationTime: number;
    isOnStage?: boolean | undefined;
    onStageDuration?: number | undefined;
    author: Id<"users">;
    bidItemId: Id<"biditems">;
  } | null;
  setCurrentItemIdx: React.Dispatch<React.SetStateAction<number>>;
  currentItemIdx: number;
  setRemoveFromStageCountDown: React.Dispatch<
    React.SetStateAction<{
      id: Id<"stageitems">;
      value: null | number;
    } | null>
  >;
  removeFromStageCountDown: {
    id: Id<"stageitems">;
    value: null | number;
  } | null;
  textingToUserId: Id<"users"> | null;
  setTextingToUserId: React.Dispatch<React.SetStateAction<Id<"users"> | null>>;
  setStartCountDown: React.Dispatch<React.SetStateAction<boolean>>;
};

export const globalDataContext = createContext<GlobalData>({
  setUserProfileId: () => {},
  userProfileId: null,
  isShowingAddBidItemModal: false,
  setIsShowingAddBidItemModal: () => {},
  onStageItem: null,
  setCurrentItemIdx: () => {},
  currentItemIdx: 0,
  removeFromStageCountDown: null,
  setRemoveFromStageCountDown: () => {},
  textingToUserId: null,
  setTextingToUserId: () => {},
  setStartCountDown: () => {},
});

export const GlobalDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userProfileId, setUserProfileId] = useState<null | Id<"users">>(null);
  const [isShowingAddBidItemModal, setIsShowingAddBidItemModal] =
    useState(false);
  const [currentItemIdx, setCurrentItemIdx] = useState(0);
  const [removeFromStageCountDown, setRemoveFromStageCountDown] = useState<{
    id: Id<"stageitems">;
    value: null | number;
  } | null>(null);
  const [textingToUserId, setTextingToUserId] = useState<Id<"users"> | null>(
    null
  );
  const onStageItems = useQuery(api.stageitems.getOnStageItems);
  const onStageItem = onStageItems?.at(currentItemIdx);
  const decreaseStageTime = useMutation(api.stageitems.decreaseStageTime);

  const [startCountDown, setStartCountDown] = useState(false);

  useEffect(() => {
    if (startCountDown) {
      const id = setInterval(() => {
        const nullValue = decreaseStageTime();
        if (!nullValue) {
          setStartCountDown(false);
        }
      }, 1000);

      return () => clearInterval(id);
    }
  }, [decreaseStageTime, startCountDown]);

  return (
    <globalDataContext.Provider
      value={{
        userProfileId,
        setUserProfileId,
        isShowingAddBidItemModal,
        setIsShowingAddBidItemModal,
        setCurrentItemIdx,
        onStageItem: onStageItem ?? null,
        currentItemIdx,
        removeFromStageCountDown,
        setRemoveFromStageCountDown,
        setTextingToUserId,
        textingToUserId,
        setStartCountDown,
      }}
    >
      {children}
    </globalDataContext.Provider>
  );
};

export const useGlobalData = () => useContext(globalDataContext);
