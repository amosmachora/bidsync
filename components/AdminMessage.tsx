import { Message } from "@/types/globals";
import { MessageSenderImage } from "./MessageSenderImage";

export const AdminMessage = ({ message }: { message: Message }) => {
  return (
    <div className="px-5 py-3 w-full border border-[#FFEFF2] rounded mb-2 flex items-center text-xs justify-between">
      {/* <MessageSenderImage senderImageUrl={"/crown.jpg"} userId={null} /> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/crown.svg" alt="crown" className="h-8 w-8 mr-5" />
      {message.body}
    </div>
  );
};
