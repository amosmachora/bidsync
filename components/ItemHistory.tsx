import { api } from "@/convex/_generated/api";
import { useGlobalData } from "@/hooks/useGlobalData";
import { minsAndSecs } from "@/lib/utils";
import { BidHistory, BidItem } from "@/types/globals";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import React from "react";
import { Overlay } from "./Overlay";
import { ScrollArea } from "./ui/scroll-area";

export const ItemHistory = ({
  item,
  close,
}: {
  item: BidItem;
  close: () => void;
}) => {
  const bidHistory = useQuery(api.bidhistories.getBidHistoryByBidItemId, {
    itemId: item._id,
  });
  return (
    <>
      <Overlay close={close} />
      <div className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md">
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <h1 className="font-semibold mb-5 text-xl">
          Bid History for <span className="italic">{item.title}</span>
        </h1>
        <div className="flex justify-between gap-x-1 text-[#9B9B9B]">
          <p className="w-1/4">Bidder</p>
          <p className="w-1/4">Amount</p>
          <p className="w-1/4">End Bid Status</p>
          <p className="w-1/4">Duration</p>
          <p className="w-1/4">Winning Bid</p>
        </div>
        <ScrollArea className="h-[50vh]">
          {bidHistory?.map((bid) => (
            <Item bid={bid} key={bid._id} closeItemHistory={close} />
          ))}
        </ScrollArea>
      </div>
    </>
  );
};

export const Item = ({
  bid,
  closeItemHistory,
}: {
  bid: BidHistory;
  closeItemHistory: () => void;
}) => {
  const user = useQuery(api.users.getUser, { userId: bid.bidder });
  const stageItem = useQuery(api.stageitems.getStageItem, {
    stageItemId: bid.stageItem,
  });
  const { setUserProfileId } = useGlobalData();
  return (
    <div className="flex justify-between gap-x-1 border-t border-[#E9E9E9] py-3">
      <div
        className="w-1/4 flex items-center text-xs"
        onClick={() => {
          closeItemHistory();
          setUserProfileId(bid.bidder);
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={user?.imageUrl}
          alt=""
          className="h-5 w-5 rounded-full mr-2"
        />
        <p>{user?.name}</p>
      </div>
      <p className="w-1/4">{bid.bidAmount} USD</p>
      <p className="w-1/4">{bid.status}</p>
      <p className="w-1/4">{minsAndSecs(stageItem?.onStageDuration)}</p>
      <p className="w-1/4">{String(bid.isBidWinner ?? false)}</p>
    </div>
  );
};
