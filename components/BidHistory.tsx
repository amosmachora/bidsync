import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "convex/react";
import React from "react";
import { Bid } from "./Bid";

export const BidHistory = () => {
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const userId = useStoreUserEffect();

  return (
    <ScrollArea className="mt-5 flex-grow">
      {onStageItem?.bidHistory?.map((bid, i) => (
        <Bid
          bid={bid}
          key={i}
          isCurrentUsersItem={onStageItem.author === userId}
        />
      ))}
    </ScrollArea>
  );
};
