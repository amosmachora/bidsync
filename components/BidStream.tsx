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

  const removeItemFromStage = useMutation(api.stageitems.removeItemFromStage);

  const [isShowingMakeBidModal, setIsShowingMakeBidModal] = useState(false);
  const currentUserId = useStoreUserEffect();

  const isCurrentUsersItemBeingBidOn: boolean =
    currentUserId === onStageBidItem?.author;

  const [removeFromStageCountDown, setRemoveFromStageCountDown] = useState<
    number | null
  >(null);

  useEffect(() => {
    if (removeFromStageCountDown === 0) {
      // this should probably be internal mutation
      removeItemFromStage({ stageItemId: onStageItem?._id! });
    }
    if (removeFromStageCountDown) {
      const id = setInterval(() => {
        setRemoveFromStageCountDown((prev) => (prev ? prev - 1 : null));
      });
      return clearInterval(id);
    }
  }, [onStageItem?._id, removeFromStageCountDown, removeItemFromStage]);

  return (
    <div className="px-[2%] flex-grow flex flex-col show">
      <p className="text-center mb-2">Bid Stream</p>
      <p className="text-center mb-2">
        {minsAndSecs(onStageItem?.onStageDuration)}
      </p>
      <BidHistory setRemoveFromStageCountDown={setRemoveFromStageCountDown} />
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
          stageItemId={onStageItem?._id!}
          close={() => setIsShowingMakeBidModal(false)}
        />
      )}
    </div>
  );
};
