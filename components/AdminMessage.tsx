import { Message } from "@/types/globals";
import { MessageSenderImage } from "./MessageSenderImage";

export const AdminMessage = ({ message }: { message: Message }) => {
  return (
    <div className="bg-yellow-500 text-white rounded-r-md w-max p-3 max-w-[50%] text-sm mb-2">
      {message.body}
      <MessageSenderImage senderImageUrl={"/crown.jpg"} userId={null} />
    </div>
  );
};
