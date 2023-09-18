import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Message } from "@/types/globals";
import { useQuery } from "convex/react";
import { MessageSenderImage } from "./MessageSenderImage";

export const NotCurrentUserMessage = ({
  message,
  userId,
}: {
  message: Message;
  userId: Id<"users">;
}) => {
  const user = useQuery(api.users.getUserImage, {
    userId,
  });

  return (
    <div className="px-5 py-3 w-full border border-[#FFEFF2] rounded mb-2 flex items-center text-xs">
      <MessageSenderImage
        senderImageUrl={user?.imageUrl ?? null}
        userId={message.author ?? null}
      />
      {message.body}
    </div>
  );
};
