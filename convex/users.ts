import { v } from "convex/values";
import { api, internal } from "./_generated/api";

import { action, internalQuery, mutation, query } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async ({ auth, db, scheduler }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (!user) {
      console.log("user was not found!");
      // a brand new user
      const userId = await db.insert("users", {
        name: identity.name!,
        tokenIdentifier: identity.tokenIdentifier,
        imageUrl: identity.pictureUrl!,
      });

      // welcome the user
      await scheduler.runAfter(0, api.messages.welcomingMessageAction, {
        name: identity.name!,
        userId,
      });

      return userId;
    }

    if (user) {
      if (user.name !== identity.name) {
        await db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }
  },
});

export const getUserImage = query({
  args: { userId: v.id("users") },
  handler: async ({ auth, db }, { userId }) => {
    const user = await db.get(userId);
    return user;
  },
});

export const userCount = query({
  args: {},
  handler: async ({ db }, {}) => {
    const userCount = (await db.query("users").collect()).length;
    return userCount;
  },
});

export const getUser = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ auth, db }, { userId }) => {
    if (!userId) {
      return null;
    }
    const user = await db.get(userId);
    return user;
  },
});
