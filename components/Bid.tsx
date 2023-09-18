import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGlobalData } from "@/hooks/useGlobalData";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { BidHistory, Status } from "@/types/globals";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction, useMutation, useQuery } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Bid = ({
  bid,
  isCurrentUsersItem,
  setRemoveFromStageCountDown,
}: {
  bid: BidHistory;
  isCurrentUsersItem: boolean;
  setRemoveFromStageCountDown: React.Dispatch<
    React.SetStateAction<number | null>
  >;
}) => {
  //bid author
  const bidAuthor = useQuery(api.users.getUser, { userId: bid.bidder });
  const acceptBidMutation = useMutation(api.bidhistories.acceptBid);
  const declineBidMutation = useMutation(api.bidhistories.declineBid);

  const currentUserId = useStoreUserEffect();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const { setUserProfileId } = useGlobalData();

  const acceptBid = async () => {
    setIsAccepting(true);
    await acceptBidMutation({ bid });
    setIsAccepting(false);
    toast.success(
      `You have accepted ${bidAuthor?.name}'s bid of ${bid.bidAmount} USD`
    );
    setRemoveFromStageCountDown(300);
  };

  const declineBid = async () => {
    setIsDeclining(true);
    await declineBidMutation({ bid });
    toast.warning(
      `You have declined ${bidAuthor?.name}'s bid of ${bid.bidAmount} USD`
    );
    setIsDeclining(false);
  };

  return (
    <div className="flex items-center justify-between text-sm gap-x-1">
      <div
        className="cursor-pointer w-1/2 flex items-center text-ellipsis text-xs"
        onClick={() => setUserProfileId!(bid.bidder)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bidAuthor?.imageUrl}
          alt=""
          className="w-5 h-5 rounded-full mr-1"
        />
        <p className="text-xs text-[#545454]">
          {bidAuthor?.name}{" "}
          <span className="italic">
            {currentUserId === bid.bidder && "(you)"}{" "}
          </span>{" "}
        </p>
      </div>
      <p className="text-green-500 font-semibold w-1/4">{bid.bidAmount} USD</p>
      {isCurrentUsersItem && bid.status === "pending" ? (
        <div className="flex w-1/4 justify-around">
          {isAccepting ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="w-5 h-5 text-green-500 cursor-pointer"
              spin
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="w-5 h-5 text-green-500 cursor-pointer"
              onClick={acceptBid}
            />
          )}
          {isDeclining ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="w-5 h-5 text-red-500 cursor-pointer"
              spin
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="w-5 h-5 text-red-500 cursor-pointer"
              onClick={declineBid}
            />
          )}
        </div>
      ) : (
        <p
          className={`${
            bid.status === "declined"
              ? "text-red-500"
              : bid.status === "accepted"
              ? "text-green-500"
              : bid.status === "outbid"
              ? "text-black"
              : "text-yellow-500"
          } w-1/4`}
        >
          {bid.status}
        </p>
      )}
    </div>
  );
};
