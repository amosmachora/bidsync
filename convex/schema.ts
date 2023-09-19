import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.optional(v.id("users")),
    isWelcomingMessage: v.optional(v.boolean()),
    isAdminMessage: v.optional(v.boolean()),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  biditems: defineTable({
    author: v.id("users"),
    price: v.string(),
    description: v.string(),
    title: v.string(),
    imageStorageIds: v.optional(v.array(v.string())),
    isSold: v.optional(v.boolean()),
  }),
  stageitems: defineTable({
    isOnStage: v.optional(v.boolean()),
    bidItemId: v.id("biditems"),
    onStageDuration: v.optional(v.number()),
    author: v.id("users"),
  }),
  notifications: defineTable({
    target: v.id("users"),
    isSuccessNotification: v.boolean(),
    hasBeenShown: v.boolean(),
    message: v.string(),
    isRead: v.boolean(),
  }),
  bidhistories: defineTable({
    isBidWinner: v.optional(v.boolean()),
    bidder: v.id("users"),
    bidAmount: v.number(),
    itemId: v.id("biditems"),
    stageItem: v.id("stageitems"),
    status: v.string(),
  }),
  privatemessages: defineTable({
    sender: v.id("users"),
    receiver: v.id("users"),
    message: v.string(),
    chatId: v.id("chats"),
    isRead: v.boolean(),
  }),
  chats: defineTable({
    participants: v.array(v.id("users")),
  }),
});
