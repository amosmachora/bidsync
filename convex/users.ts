import { v } from "convex/values";
import { api } from "./_generated/api";
import { mutation, query } from "./_generated/server";

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

    if (user !== null) {
      if (user.name !== identity.name) {
        await db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    const userId = await db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl!,
    });

    scheduler.runAfter(0, api.messages.newMessageAction, {
      name: identity.name!,
      userId,
    });

    return userId;
  },
});

export const getUserImage = query({
  args: { userId: v.id("users") },
  handler: async ({ auth, db }, { userId }) => {
    const user = await db.get(userId);
    return user;
  },
});
