import { api } from "@/convex/_generated/api";
import { useGlobalData } from "@/hooks/useGlobalData";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { Bid } from "./Bid";
import { MakeBidModal } from "./MakeBidModal";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export const BidStream = () => {
  const { onStageItem } = useGlobalData();
  const userId = useStoreUserEffect();
  const bidHistories = useQuery(api.bidhistories.getAllBidsByStageItemId, {
    stageItemId: onStageItem?._id,
  });

  return (
    <div className="px-[2%] flex-grow flex flex-col h-full">
      <p className="font-semibold mb-2">Bid Stream</p>
      <div className="bg-white rounded-md p-5 h-full">
        <div className="text-[#9B9B9B] text-center">
          <p className="mb-2 text-2xl">
            {minsAndSecs(onStageItem?.onStageDuration)}
          </p>
          <p className="text-sm mb-3">Time left:</p>
        </div>
        <div className="flex text-sm font-semibold justify-between items-center">
          <p>Total bids: {bidHistories?.length}</p>
          <div className="flex items-center cursor-pointer">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mr-1"
            >
              <path
                d="M18.75 12C18.75 12.1989 18.671 12.3897 18.5303 12.5303C18.3897 12.671 18.1989 12.75 18 12.75H6C5.80109 12.75 5.61032 12.671 5.46967 12.5303C5.32902 12.3897 5.25 12.1989 5.25 12C5.25 11.8011 5.32902 11.6103 5.46967 11.4697C5.61032 11.329 5.80109 11.25 6 11.25H18C18.1989 11.25 18.3897 11.329 18.5303 11.4697C18.671 11.6103 18.75 11.8011 18.75 12ZM21.75 6.75H2.25C2.05109 6.75 1.86032 6.82902 1.71967 6.96967C1.57902 7.11032 1.5 7.30109 1.5 7.5C1.5 7.69891 1.57902 7.88968 1.71967 8.03033C1.86032 8.17098 2.05109 8.25 2.25 8.25H21.75C21.9489 8.25 22.1397 8.17098 22.2803 8.03033C22.421 7.88968 22.5 7.69891 22.5 7.5C22.5 7.30109 22.421 7.11032 22.2803 6.96967C22.1397 6.82902 21.9489 6.75 21.75 6.75ZM14.25 15.75H9.75C9.55109 15.75 9.36032 15.829 9.21967 15.9697C9.07902 16.1103 9 16.3011 9 16.5C9 16.6989 9.07902 16.8897 9.21967 17.0303C9.36032 17.171 9.55109 17.25 9.75 17.25H14.25C14.4489 17.25 14.6397 17.171 14.7803 17.0303C14.921 16.8897 15 16.6989 15 16.5C15 16.3011 14.921 16.1103 14.7803 15.9697C14.6397 15.829 14.4489 15.75 14.25 15.75Z"
                fill="#2D2B2B"
              />
            </svg>
            <p>Filter</p>
          </div>
        </div>
        <div className="flex text-[#9B9B9B] text-sm my-4 justify-between gap-x-1">
          <p className="w-1/2">Bidder</p>
          <p className="w-1/4">Amount</p>
          <p className="w-1/4">Action</p>
        </div>
        <ScrollArea className="h-full">
          {bidHistories?.length! > 0 ? (
            bidHistories?.map((bid, i) => (
              <Bid
                bid={bid}
                key={i}
                isCurrentUsersItem={onStageItem?.author === userId}
              />
            ))
          ) : (
            <p>No Bids Yet!</p>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};
