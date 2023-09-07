import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    author: v.id("users"),
    isWelcomingMessage: v.optional(v.boolean()),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    imageUrl: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
