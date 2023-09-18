import { Message } from "@/types/globals";
import { useUser } from "@clerk/clerk-react";
import { MessageSenderImage } from "./MessageSenderImage";

export const CurrentUserMessage = ({ message }: { message: Message }) => {
  const { user } = useUser();
  return (
    <div className="px-5 py-3 w-full border border-[#FFEFF2] rounded mb-2 flex items-center text-xs">
      <MessageSenderImage
        senderImageUrl={user?.hasImage ? user.imageUrl : null}
        userId={message.author ?? null}
      />
      {message.body}
    </div>
  );
};
