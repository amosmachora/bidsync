import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { BidItem } from "./BidItem";

export const SoldItems = () => {
  const bidItems = useQuery(api.biditems.getLatestTwoSoldItems);

  console.log(bidItems);
  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <p className="font-semibold">Sold Items</p>
        <p className="text-sm text-red-500 cursor-pointer">See all</p>
      </div>
      <div className="flex gap-x-5">
        {bidItems?.map((item) => (
          <BidItem item={item} key={item._id} />
        ))}
      </div>
    </div>
  );
};
