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
    <div className="bg-gray-500 text-white rounded-r-md w-max p-3 max-w-[50%] text-sm mb-2">
      {message.body}
      <MessageSenderImage
        senderImageUrl={user?.imageUrl ?? null}
        userId={message.author ?? null}
      />
    </div>
  );
};
