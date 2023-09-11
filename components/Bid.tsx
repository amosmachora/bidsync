import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction, useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export const Bid = ({
  bid,
  isCurrentUsersItem,
}: {
  bid: { author: Id<"users">; bidAmount: number };
  isCurrentUsersItem: boolean;
}) => {
  //bid author
  const user = useQuery(api.users.getUser, { userId: bid.author });
  const acceptBidMutation = useMutation(api.stageitems.acceptBid);
  const removeItemFromStage = useMutation(api.stageitems.removeItemFromStage);
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const createNotification = useMutation(api.notifications.createNotification);
  const adminMessageAction = useAction(api.messages.adminMessageAction);

  const currentUserId = useStoreUserEffect();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const acceptBid = async () => {
    setIsAccepting(true);
    await acceptBidMutation({
      bidWinner: bid.author,
      stageItemId: onStageItem?._id!,
    });
    setIsAccepting(false);
    await adminMessageAction({ message: `${user?.name} won the bid!` });
    toast.success(
      `You have accepted ${user?.name}'s bid of ${bid.bidAmount} USD`
    );

    // this should probably be internal mutations
    await removeItemFromStage({ stageItemId: onStageItem?._id! });
    await createNotification({
      hasBeenShown: false,
      isSuccessNotification: true,
      message: `Your bid of ${bid.bidAmount} was accepted`,
      target: bid.author,
    });
  };

  const declineBid = async () => {
    setIsDeclining(true);
    toast.warning(
      `You have declined ${user?.name}'s bid of ${bid.bidAmount} USD`
    );
    await createNotification({
      hasBeenShown: false,
      isSuccessNotification: false,
      message: `Your bid of ${bid.bidAmount} USD was denied`,
      target: bid.author,
    });
    setIsDeclining(false);
  };

  return (
    <div className="flex items-center show justify-between text-sm px-5">
      <p className="text-green-500 font-semibold">{bid.bidAmount} USD</p>
      <div className="show">
        <p className="text-xs">
          {user?.name}{" "}
          <span className="italic">
            {currentUserId === bid.author && "(you)"}{" "}
          </span>{" "}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user?.imageUrl} alt="" className="w-7 h-7 rounded ml-auto" />
      </div>
      {isCurrentUsersItem && (
        <div className="flex">
          {isAccepting ? (
            <FontAwesomeIcon
              icon={faCircleNotch}
              className="w-5 h-5 mr-2 text-green-500 cursor-pointer"
              spin
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleCheck}
              className="w-5 h-5 mr-2 text-green-500 cursor-pointer"
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
      )}
    </div>
  );
};
