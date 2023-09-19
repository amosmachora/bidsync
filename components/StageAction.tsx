import { removeItemFromStage } from "@/convex/stageitems";
import { api } from "@/convex/_generated/api";
import { useGlobalData } from "@/hooks/useGlobalData";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { useQuery, useMutation } from "convex/react";
import React, { useState, useEffect } from "react";
import { MakeBidModal } from "./MakeBidModal";
import { Button } from "./ui/button";

export const StageAction = () => {
  // the item on stage
  const { onStageItem, removeFromStageCountDown, setRemoveFromStageCountDown } =
    useGlobalData();
  const removeItemFromStage = useMutation(api.stageitems.removeItemFromStage);

  // the actual item
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });

  const userId = useStoreUserEffect();
  const isCurrentUsersItemBeingBidOn: boolean =
    userId === onStageBidItem?.author;

  const [isShowingMakeBidModal, setIsShowingMakeBidModal] = useState(false);

  const bidHistories = useQuery(api.bidhistories.getAllBidsByStageItemId, {
    stageItemId: onStageItem?._id,
  });

  useEffect(() => {
    if (removeFromStageCountDown?.value === 0) {
      // This should probably be an internal mutation
      removeItemFromStage({ stageItemId: onStageItem?._id! });
    }
    if (removeFromStageCountDown) {
      const id = setInterval(() => {
        setRemoveFromStageCountDown((prev) =>
          prev?.value ? { ...prev, value: prev.value - 1 } : null
        );
      }, 1000);
      return () => clearInterval(id);
    }
  }, [
    onStageItem?._id,
    removeFromStageCountDown,
    removeItemFromStage,
    setRemoveFromStageCountDown,
  ]);

  return (
    <>
      {!isCurrentUsersItemBeingBidOn ? (
        <Button
          className="w-full mt-auto bg-green-500 hover:bg-green-400 text-sm"
          onClick={() => setIsShowingMakeBidModal(true)}
        >
          Bid on this item
        </Button>
      ) : (
        <Button
          className="w-full mt-auto bg-red-500 hover:bg-red-400 text-sm"
          onClick={() =>
            removeItemFromStage({ stageItemId: onStageItem?._id! })
          }
        >
          Remove item from stage{" "}
          {removeFromStageCountDown?.id === onStageItem?._id &&
            minsAndSecs(removeFromStageCountDown?.value ?? undefined)}
        </Button>
      )}
      {isShowingMakeBidModal && (
        <MakeBidModal
          close={() => setIsShowingMakeBidModal(false)}
          latestBid={bidHistories
            ?.sort((a, b) => b._creationTime - a._creationTime)
            .at(0)}
        />
      )}
    </>
  );
};
