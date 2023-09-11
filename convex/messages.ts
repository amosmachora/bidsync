import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

export const welcomingMessage = internalMutation({
  args: { userId: v.id("users"), name: v.string() },
  handler: async ({ auth, db }, { userId, name }) => {
    const insertDocId = await db.insert("messages", {
      body: `Welcoming ${name}!`,
      author: userId,
      isWelcomingMessage: true,
    });

    return insertDocId;
  },
});

export const adminMessage = internalMutation({
  args: { message: v.string() },
  handler: async ({ db }, { message }) => {
    const insertDocId = await db.insert("messages", {
      body: message,
      isAdminMessage: true,
    });

    return insertDocId;
  },
});

export const adminMessageAction = action({
  args: { message: v.string() },
  handler: async ({ runMutation }, { message }) => {
    await runMutation(internal.messages.adminMessage, { message });
  },
});

export const welcomingMessageAction = action({
  args: { name: v.string(), userId: v.id("users") },
  handler: async ({ runMutation }, { name, userId }) => {
    await runMutation(internal.messages.welcomingMessage, { name, userId });
  },
});

export const getAllMessages = query({
  args: {},
  handler: async ({ db, auth }) => {
    const messages = await db.query("messages").order("desc").take(100);

    return messages.reverse();
  },
});

export const sendNewMessage = mutation({
  args: { body: v.string(), author: v.id("users") },
  handler: async ({ db }, { author, body }) => {
    return await db.insert("messages", { body, author });
  },
});
