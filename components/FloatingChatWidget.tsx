import { api } from "@/convex/_generated/api";
import { useGlobalData } from "@/hooks/useGlobalData";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { useQuery } from "convex/react";
import React from "react";

export const FloatingChatWidget = () => {
  const userId = useStoreUserEffect();
  const { setTextingToUserId } = useGlobalData();
  const allUnreadUserMessages = useQuery(
    api.privatemessages.getAllUnreadUserMessages,
    { userId: userId ?? undefined }
  );
  return (
    <div className="fixed bottom-5 right-5 flex items-center gap-x-2">
      {allUnreadUserMessages?.map((message) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/floatingwidget.svg"
          alt=""
          className="h-24 w-24 cursor-pointer"
          key={message._id}
          onClick={() => setTextingToUserId(message.sender)}
        />
      ))}
    </div>
  );
};
