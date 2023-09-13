import { Message } from "@/types/globals";
import { useUser } from "@clerk/clerk-react";
import { MessageSenderImage } from "./MessageSenderImage";

export const CurrentUserMessage = ({ message }: { message: Message }) => {
  const { user } = useUser();
  return (
    <div className="ml-auto bg-blue-500 text-white rounded-l-md w-max p-3 max-w-[50%] text-sm flex flex-col items-end mb-2">
      {message.body}
      <MessageSenderImage
        senderImageUrl={user?.hasImage ? user.imageUrl : null}
        userId={message.author ?? null}
      />
    </div>
  );
};
