import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { BidHistory } from "./BidHistory";
import { MakeBidModal } from "./MakeBidModal";
import { Button } from "./ui/button";

export const BidStream = () => {
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });
  const decreaseStageTime = useMutation(api.stageitems.decreaseStageTime);

  const [isShowingMakeBidModal, setIsShowingMakeBidModal] = useState(false);
  const currentUserId = useStoreUserEffect();

  const isCurrentUsersItemBeingBidOn: boolean =
    currentUserId === onStageBidItem?.author;

  useEffect(() => {
    if (onStageItem) {
      const id = setInterval(() => {
        decreaseStageTime({ stageItemId: onStageItem._id });
      }, 1000);
      return () => clearInterval(id);
    }
  }, [decreaseStageTime, onStageItem]);

  return (
    <div className="px-[2%] flex-grow flex flex-col show">
      <p className="text-center mb-2">Bid Stream</p>
      <p className="text-center mb-2">
        {minsAndSecs(onStageItem?.onStageDuration)}
      </p>
      <BidHistory />
      {!isCurrentUsersItemBeingBidOn && (
        <Button
          className="w-full mt-5 bg-green-500 hover:bg-green-400"
          onClick={() => setIsShowingMakeBidModal(true)}
        >
          Bid on this item
        </Button>
      )}
      {isShowingMakeBidModal && (
        <MakeBidModal
          stageItemId={onStageItem?._id!}
          close={() => setIsShowingMakeBidModal(false)}
        />
      )}
    </div>
  );
};
