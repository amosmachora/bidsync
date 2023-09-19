import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getChatId = query({
  args: {
    sender: v.optional(v.id("users")),
    receiver: v.optional(v.id("users")),
  },
  handler: async ({ db }, { sender, receiver }) => {
    if (!sender || !receiver) {
      return null;
    }

    const allChats = await db.query("chats").collect();
    const participantChat = allChats.filter(
      (chat) =>
        chat.participants.includes(sender) &&
        chat.participants.includes(receiver)
    );

    if (participantChat.length > 0) {
      return participantChat.at(0)?._id;
    }

    return null;
  },
});

export const createChatRoom = mutation({
  args: { sender: v.id("users"), receiver: v.id("users") },
  handler: async ({ db }, { sender, receiver }) => {
    return await db.insert("chats", { participants: [sender, receiver] });
  },
});
