import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useGlobalData } from "@/hooks/useGlobalData";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import React from "react";
import { Overlay } from "./Overlay";
import { ScrollArea } from "./ui/scroll-area";

const UserProfileData = () => {
  const { userProfileId: userId, setUserProfileId } = useGlobalData();
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

  const close = () => {
    setUserProfileId(null);
  };

  if (!userId) {
    return null;
  }

  return (
    <>
      <Overlay close={close}>
        <form className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-lg shadow-red-200">
          <FontAwesomeIcon
            icon={faXmark}
            className="h-5 w-5 ml-auto cursor-pointer absolute top-5 right-5"
            onClick={close}
          />
          <p className="font-semibold text-2xl">Bid History</p>
          <div className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user?.imageUrl}
              alt=""
              className="w-10 h-10 rounded-full mr-2"
            />
            <p>{user?.name}</p>
          </div>
          <div className="flex text-sm text-[#9B9B9B] justify-between w-2/3">
            <p>{numberOfWonBids} won bids</p>
            <p>{numberOfOutbidBids} outbid bids</p>
            <p>{numberOfDeclinedBids} declined bids</p>
          </div>
          <div className="flex justify-between mt-5">
            <p className="w-1/4">Amount</p>
            <p className="w-1/4 text-left">Won Bid?</p>
            <p className="w-1/4">Status</p>
          </div>
          <ScrollArea className="h-[50vh] flex flex-col gap-y-4">
            {userBidHistory?.map((bid) => (
              <div
                key={bid._id}
                className="flex justify-between border-y border-[#E9E9E9] py-2"
              >
                <p className="w-1/4">{bid.bidAmount} USD</p>
                <p className="w-1/4 text-left">
                  {bid.isBidWinner ? "true" : "false"}
                </p>
                <p className="w-1/4">{bid.status}</p>
              </div>
            ))}
          </ScrollArea>
        </form>
      </Overlay>
    </>
  );
};

export default UserProfileData;
