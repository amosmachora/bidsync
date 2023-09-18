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
import { Textarea } from "./ui/textarea";

export const Chat = () => {
  const messages = useQuery(api.messages.getAllMessages);
  const currentUserId = useStoreUserEffect();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitMessage = useMutation(api.messages.sendNewMessage);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
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
    <div className="flex-grow flex flex-col">
      <ScrollArea className="flex-grow h-[0px]">
        {messages?.map((message, i) => {
          const isCurrentUsersMessage = message.author === currentUserId;
          return message.isWelcomingMessage ? (
            <AdminMessage message={message} key={i} />
          ) : isCurrentUsersMessage ? (
            <CurrentUserMessage message={message} key={i} />
          ) : message.isAdminMessage ? (
            <AdminMessage message={message} key={i} />
          ) : (
            <NotCurrentUserMessage
              message={message}
              userId={message.author!}
              key={i}
            />
          );
        })}
        <div ref={invincibleDiv} />
      </ScrollArea>
      <form onSubmit={handleSubmit} className="mt-5">
        <div className="flex relative">
          <Textarea
            placeholder="Type your message here."
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
              <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
