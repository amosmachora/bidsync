import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import { BidItem } from "./BidItem";
import { Overlay } from "./Overlay";

export const WholeAppBidHistory = ({
  close,
  type,
}: {
  close: () => void;
  type: "all-items" | "my-items";
}) => {
  const allSoldItems = useQuery(api.biditems.getAllSoldItems);
  const userId = useStoreUserEffect();
  const userItems = useQuery(api.biditems.getBidItemsByUserId, {
    userId: userId ?? undefined,
  });

  return (
    <>
      <Overlay close={close} />
      <div className="gap-y-5 flex flex-col fixed top-5 z-50 rounded-md bg-white p-[3%] w-10/12 left-1/2 -translate-x-1/2 shadow-lg shadow-red-100 h-[85vh] overflow-y-auto">
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <h1 className="mt-5 font-semibold">Bid Items & History</h1>
        <div className="flex gap-x-5 flex-grow h-[400px] flex-wrap">
          {type === "all-items"
            ? allSoldItems?.map((item) => (
                <BidItem key={item._id} item={item} />
              ))
            : userItems?.map((item) => <BidItem key={item._id} item={item} />)}
        </div>
      </div>
    </>
  );
};
