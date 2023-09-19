import { api } from "@/convex/_generated/api";
import { useGlobalData } from "@/hooks/useGlobalData";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { getReadableTime } from "@/lib/utils";
import { useMutation, useQuery } from "convex/react";
import React, { FormEvent, useEffect, useRef } from "react";
import { Overlay } from "./Overlay";
import { Input } from "./ui/input";

export const PrivateMessageChatBox = () => {
  const { textingToUserId, setTextingToUserId } = useGlobalData();
  const sendMessage = useMutation(api.privatemessages.sendMessage);
  const userId = useStoreUserEffect();

  const receiver = useQuery(api.users.getUser, {
    userId: textingToUserId ?? undefined,
  });
  const messageRef = useRef<HTMLInputElement>(null);
  const chatId = useQuery(api.chats.getChatId, {
    receiver: textingToUserId ?? undefined,
    sender: userId ?? undefined,
  });
  const createChatRoom = useMutation(api.chats.createChatRoom);
  const markUnreadMessagesAsRead = useMutation(
    api.privatemessages.markMessagesAsRead
  );

  const chatRoomMessages = useQuery(
    api.privatemessages.getAllMessagesByChatId,
    { chatId: chatId ?? undefined }
  );
  const invincibleDiv = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    invincibleDiv.current?.scrollIntoView({ behavior: "smooth" });
    if (userId) {
      markUnreadMessagesAsRead({
        chatRoomId: chatId ?? undefined,
        receiverId: userId!,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRoomMessages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (chatId) {
      await sendMessage({
        message: messageRef.current?.value!,
        receiver: textingToUserId!,
        sender: userId!,
        chatId,
      });
      messageRef.current!.value = "";
      return;
    }

    const newChatRoomId = await createChatRoom({
      receiver: textingToUserId!,
      sender: userId!,
    });

    await sendMessage({
      message: messageRef.current?.value!,
      receiver: textingToUserId!,
      sender: userId!,
      chatId: newChatRoomId,
    });
    messageRef.current!.value = "";
  };

  if (!textingToUserId) {
    return null;
  }

  return (
    <Overlay>
      <div className="fixed right-0 bottom-0 top-0 w-1/4 flex flex-col">
        <div className="p-5 relative text-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={receiver?.imageUrl}
            alt=""
            className="h-8 w-8 rounded-full"
          />
          <p className="font-semibold text-xl mt-5">{receiver?.name}</p>
          <p className="text-xs mt-2">
            A live chat interface that allows for seamless, natural
            communication and connection.
          </p>
          <svg
            width="450"
            height="239"
            viewBox="0 0 450 239"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-0 right-0 left-0 -z-10 bottom-0"
          >
            <path
              d="M0 7.99999C0 3.58172 3.58172 0 8 0H442C446.418 0 450 3.58172 450 8V239H0V7.99999Z"
              fill="#D9D9D9"
            />
            <path
              d="M0 7.99999C0 3.58172 3.58172 0 8 0H442C446.418 0 450 3.58172 450 8V239H0V7.99999Z"
              fill="url(#paint0_angular_5_114)"
            />
            <defs>
              <radialGradient
                id="paint0_angular_5_114"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(368 55.5) rotate(127.929) scale(232.64 438.025)"
              >
                <stop stop-color="#4629F2" />
                <stop offset="0.348958" stop-color="#13C6FF" />
                <stop offset="0.598958" stop-color="#B94DFB" />
                <stop offset="0.817708" stop-color="#FF53EE" />
                <stop offset="1" stop-color="#F3B960" />
              </radialGradient>
            </defs>
          </svg>
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute top-5 right-5 cursor-pointer"
            onClick={() => setTextingToUserId(null)}
          >
            <rect
              width="40"
              height="40"
              rx="20"
              fill="white"
              fill-opacity="0.2"
            />
            <path
              d="M26 14L14 26"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M14 14L26 26"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div className="bg-white p-5 flex-grow flex flex-col gap-y-5">
          {chatRoomMessages?.map((message) => {
            if (message.sender === userId) {
              return (
                <p
                  key={message._id}
                  className="ml-auto bg-[#4629F2] text-white rounded-l rounded-br py-[10px] px-4 relative text-sm"
                >
                  {message.message}
                  <span className="absolute -bottom-5 left-0 text-gray-500 text-xs">
                    {getReadableTime(message._creationTime)}
                  </span>
                </p>
              );
            }
            return (
              <div key={message._id} className="flex items-start">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={receiver?.imageUrl}
                  alt=""
                  className="h-5 w-5 rounded-full mr-3"
                />
                <div>
                  <p className="text-[#0D082C] w-max text-sm">
                    {receiver?.name.split(" ").at(0)}
                  </p>
                  <p className="rounded-r bg-[#F1F7FF] rounded-bl py-[10px] px-4 relative text-sm mt-1">
                    {message.message}
                    <span className="absolute -bottom-5 right-0 text-gray-500 text-xs">
                      {getReadableTime(message._creationTime)}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={invincibleDiv} />

          <form
            onSubmit={handleSubmit}
            className="mt-auto flex items-center gap-x-2"
          >
            <Input
              placeholder="Type your message here."
              name="message"
              ref={messageRef}
              required
            />
            <button type="submit">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
              >
                <rect width="40" height="40" rx="20" fill="#4629F2" />
                <path
                  d="M17 26L23 20L17 14"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </Overlay>
  );
};
