import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { MessageSenderImage } from "./MessageSenderImage";

export const NotCurrentUserMessage = ({
  message,
  userId,
}: {
  message: string;
  userId: Id<"users">;
}) => {
  const user = useQuery(api.users.getUserImage, {
    userId,
  });

  return (
    <div className="bg-gray-500 text-white rounded-r-md w-max p-3 max-w-[50%] text-sm">
      {message}
      <MessageSenderImage senderImageUrl={user?.imageUrl ?? null} />
    </div>
  );
};
