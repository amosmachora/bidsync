import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { BidItem } from "./BidItem";
import { WholeAppBidHistory } from "./WholeAppBidHistory";

export const SoldItems = () => {
  const bidItems = useQuery(api.biditems.getLatestTwoSoldItems);
  const [isShowingBidHistory, setIsShowingBidHistory] = useState(false);
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <p className="font-semibold">Todays sold items</p>
        <p
          className="text-sm text-red-500 cursor-pointer"
          onClick={() => setIsShowingBidHistory(true)}
        >
          See all
        </p>
      </div>
      <div className="flex gap-x-5">
        {bidItems?.map((item) => (
          <BidItem item={item} key={item._id} minimized />
        ))}
      </div>
      {isShowingBidHistory && (
        <WholeAppBidHistory
          close={() => setIsShowingBidHistory(false)}
          type="all-items"
        />
      )}
    </div>
  );
};
