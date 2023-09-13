import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { Bid } from "./Bid";
import { MakeBidModal } from "./MakeBidModal";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export const BidStream = () => {
  // the item on stage
  const onStageItem = useQuery(api.stageitems.getOnStageItem);
  const removeItemFromStage = useMutation(api.stageitems.removeItemFromStage);

  // the actual item
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });

  const bidHistories = useQuery(api.bidhistories.getAllBidsByStageItemId, {
    stageItemId: onStageItem?._id,
  });

  const userId = useStoreUserEffect();
  const isCurrentUsersItemBeingBidOn: boolean =
    userId === onStageBidItem?.author;

  const [isShowingMakeBidModal, setIsShowingMakeBidModal] = useState(false);
  const [removeFromStageCountDown, setRemoveFromStageCountDown] = useState<
    number | null
  >(null);

  console.log(removeFromStageCountDown);
  console.log(bidHistories);

  useEffect(() => {
    if (removeFromStageCountDown === 0) {
      // This should probably be an internal mutation
      removeItemFromStage({ stageItemId: onStageItem?._id! });
    }
    if (removeFromStageCountDown) {
      const id = setInterval(() => {
        setRemoveFromStageCountDown((prev) => (prev ? prev - 1 : null));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [onStageItem?._id, removeFromStageCountDown, removeItemFromStage]);

  return (
    <div className="px-[2%] flex-grow flex flex-col show">
      <p className="text-center mb-2">Bid Stream</p>
      <p className="text-center mb-2">
        {minsAndSecs(onStageItem?.onStageDuration)}
      </p>
      <div className="mt-5 flex-grow">
        <ScrollArea>
          <div className="flex flex-col gap-y-2 h-full">
            {bidHistories?.length! > 0 ? (
              bidHistories?.map((bid, i) => (
                <Bid
                  bid={bid}
                  key={i}
                  isCurrentUsersItem={onStageItem?.author === userId}
                  setRemoveFromStageCountDown={setRemoveFromStageCountDown}
                />
              ))
            ) : (
              <p>No Bids Yet!</p>
            )}
          </div>
        </ScrollArea>
      </div>
      {!isCurrentUsersItemBeingBidOn ? (
        <Button
          className="w-full mt-5 bg-green-500 hover:bg-green-400"
          onClick={() => setIsShowingMakeBidModal(true)}
        >
          Bid on this item
        </Button>
      ) : (
        <Button
          className="w-full mt-5 bg-red-500 hover:bg-red-400"
          onClick={() =>
            removeItemFromStage({ stageItemId: onStageItem?._id! })
          }
        >
          Remove item from stage{" "}
          {removeFromStageCountDown && minsAndSecs(removeFromStageCountDown)}
        </Button>
      )}

      {isShowingMakeBidModal && (
        <MakeBidModal
          close={() => setIsShowingMakeBidModal(false)}
          latestBid={bidHistories
            ?.sort((a, b) => a._creationTime - b._creationTime)
            .at(0)}
        />
      )}
    </div>
  );
};
