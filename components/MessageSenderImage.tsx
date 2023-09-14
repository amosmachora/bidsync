import { Id } from "@/convex/_generated/dataModel";
import { useGlobalData } from "@/hooks/useGlobalData";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";

export const MessageSenderImage = ({
  senderImageUrl,
  userId,
}: {
  senderImageUrl: string | null;
  userId: null | Id<"users">;
}) => {
  const { setUserProfileId } = useGlobalData();
  return (
    <div
      className={`w-4 h-4 outline outline-blue-500 outline-2 rounded-full relative overflow-clip mt-2 ${
        userId && "cursor-pointer"
      }`}
      onClick={() => {
        if (userId) {
          setUserProfileId!(userId);
        }
      }}
    >
      {senderImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={senderImageUrl} alt={""} className="" />
      ) : (
        <FontAwesomeIcon icon={faUser} className="w-2 h-2 center-absolutely" />
      )}
    </div>
  );
};
