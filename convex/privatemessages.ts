import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const sendMessage = mutation({
  args: {
    sender: v.id("users"),
    receiver: v.id("users"),
    message: v.string(),
    chatId: v.id("chats"),
  },
  handler: async ({ db, scheduler }, args) => {
    return await db.insert("privatemessages", { ...args, isRead: false });
  },
});

export const getAllMessagesByChatId = query({
  args: {
    chatId: v.optional(v.id("chats")),
  },
  handler: async ({ db }, { chatId }) => {
    if (!chatId) {
      return null;
    }

    return await db
      .query("privatemessages")
      .filter((q) => q.eq(q.field("chatId"), chatId))
      .collect();
  },
});

export const markMessagesAsRead = mutation({
  args: { chatRoomId: v.optional(v.id("chats")), receiverId: v.id("users") },
  handler: async ({ db }, { chatRoomId, receiverId }) => {
    if (!chatRoomId) {
      return null;
    }

    const allUnreadRoomMessages = await db
      .query("privatemessages")
      .filter((q) => q.eq(q.field("chatId"), chatRoomId))
      .filter((q) => q.eq(q.field("receiver"), receiverId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();

    for (const message of allUnreadRoomMessages) {
      await db.patch(message._id, { isRead: true });
    }
  },
});

export const getAllUnreadUserMessages = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db }, { userId }) => {
    if (!userId) {
      return null;
    }
    return await db
      .query("privatemessages")
      .filter((q) => q.eq(q.field("receiver"), userId))
      .filter((q) => q.eq(q.field("isRead"), false))
      .collect();
  },
});
