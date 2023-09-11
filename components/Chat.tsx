import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { useClerk } from "@clerk/clerk-react";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery } from "convex/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { AdminMessage } from "./AdminMessage";
import { CurrentUserMessage } from "./CurrentUserMessage";
import { NotCurrentUserMessage } from "./NotCurrentUserMessage";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";

export const Chat = () => {
  const messages = useQuery(api.messages.getAllMessages);
  const currentUserId = useStoreUserEffect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitMessage = useMutation(api.messages.sendNewMessage);
  const messageRef = useRef<HTMLInputElement | null>(null);
  const { openSignIn } = useClerk();
  const invincibleDiv = useRef<HTMLDivElement | null>(null);
  const userCount = useQuery(api.users.userCount);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    setIsSubmitting(true);

    if (!currentUserId) {
      openSignIn();
      setIsSubmitting(false);
      return;
    }

    await submitMessage({
      author: currentUserId!,
      body: formData.get("message") as string,
    });

    setIsSubmitting(false);
    messageRef.current!.value = "";
  };

  useEffect(() => {
    invincibleDiv.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-1/4 flex flex-col relative pb-4 overflow-y-auto h-full">
      <p className="text-white bg-green-500 rounded-b-sm absolute top-o right-0 w-max p-3 text-xs z-50">
        {userCount} AU
      </p>
      <ScrollArea className="show flex-grow h-[80vh]">
        {messages?.map((message, i) => {
          const isCurrentUsersMessage = message.author === currentUserId;
          return message.isWelcomingMessage ? (
            <AdminMessage message={message.body} key={i} />
          ) : isCurrentUsersMessage ? (
            <CurrentUserMessage message={message.body} key={i} />
          ) : message.isAdminMessage ? (
            <AdminMessage message={message.body} key={i} />
          ) : (
            <NotCurrentUserMessage
              message={message.body}
              userId={message.author!}
              key={i}
            />
          );
        })}
        <div ref={invincibleDiv} />
      </ScrollArea>
      <form onSubmit={handleSubmit}>
        <div className="flex relative">
          <Input
            className="w-full"
            placeholder="Type your message here"
            name="message"
            ref={messageRef}
            required
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            {isSubmitting ? (
              <FontAwesomeIcon icon={faCircleNotch} spin className="w-4 h-4" />
            ) : (
              <FontAwesomeIcon icon={faPaperPlane} className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
