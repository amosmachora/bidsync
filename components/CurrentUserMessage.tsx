import { useUser } from "@clerk/clerk-react";
import { MessageSenderImage } from "./MessageSenderImage";

export const CurrentUserMessage = ({ message }: { message: string }) => {
  const { user } = useUser();
  return (
    <div className="ml-auto bg-blue-500 text-white rounded-l-md w-max p-3 max-w-[50%] text-sm flex flex-col items-end">
      {message}
      <MessageSenderImage
        senderImageUrl={user?.hasImage ? user.imageUrl : null}
      />
    </div>
  );
};
