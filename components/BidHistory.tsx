import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "convex/react";
import React from "react";
import { Bid } from "./Bid";

export const BidHistory = ({
  setRemoveFromStageCountDown,
}: {
  setRemoveFromStageCountDown: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}) => {
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const userId = useStoreUserEffect();

  return (
    <div className="mt-5 flex-grow">
      <ScrollArea>
        <div className="flex flex-col gap-y-2 h-full">
          {onStageItem?.bidHistory ? (
            onStageItem?.bidHistory?.map((bid, i) => (
              <Bid
                bid={bid}
                key={i}
                isCurrentUsersItem={onStageItem.author === userId}
                setRemoveFromStageCountDown={setRemoveFromStageCountDown}
              />
            ))
          ) : (
            <p>No Bids Yet!</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
