import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import React from "react";
import { Overlay } from "./Overlay";

const UserProfileData = ({
  userId,
  close,
}: {
  userId: Id<"users"> | null;
  close: () => void;
}) => {
  const user = useQuery(api.users.getUser, { userId: userId ?? undefined });
  const userBidHistory = useQuery(api.bidhistories.getUserBidHistory, {
    userId: userId ?? undefined,
  });
  const numberOfWonBids = userBidHistory?.filter(
    (bid) => bid.isBidWinner
  ).length;
  const numberOfOutbidBids = userBidHistory?.filter(
    (bid) => bid.status === "outbid"
  ).length;
  const numberOfDeclinedBids = userBidHistory?.filter(
    (bid) => bid.status === "declined"
  ).length;
  return (
    <Overlay>
      <form className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md">
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 text-blue-600 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <div className="flex justify-between">
          <p>{user?.name}</p>
          <p>{numberOfWonBids} won bids</p>
          <p>{numberOfOutbidBids} outbid bids</p>
          <p>{numberOfDeclinedBids} declined bids</p>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={user?.imageUrl} alt="" className="w-10 h-10 rounded-full" />
        <p>Bid History</p>
        {userBidHistory?.map((bid) => (
          <div key={bid._id} className="flex justify-between">
            <p>{bid.bidAmount} USD</p>
            <p>{bid.isBidWinner ? "true" : "false"}</p>
            <p>{bid.status}</p>
          </div>
        ))}
      </form>
    </Overlay>
  );
};

export default UserProfileData;
