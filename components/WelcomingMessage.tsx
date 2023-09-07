import { MessageSenderImage } from "./MessageSenderImage";

export const WelcomingMessage = ({ message }: { message: string }) => {
  return (
    <div className="bg-yellow-500 text-white rounded-r-md w-max p-3 max-w-[50%] text-sm">
      {message}
      <MessageSenderImage senderImageUrl={null} />
    </div>
  );
};
