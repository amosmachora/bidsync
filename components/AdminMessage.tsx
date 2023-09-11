import { MessageSenderImage } from "./MessageSenderImage";

export const AdminMessage = ({ message }: { message: string }) => {
  return (
    <div className="bg-yellow-500 text-white rounded-r-md w-max p-3 max-w-[50%] text-sm mb-2">
      {message}
      <MessageSenderImage senderImageUrl={"/crown.jpg"} />
    </div>
  );
};
