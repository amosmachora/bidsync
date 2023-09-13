import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

// notification by user
export const getAllNotifications = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db }, { userId }) => {
    return db
      .query("notifications")
      .filter((q) => q.eq(q.field("target"), userId))
      .collect();
  },
});

export const getAllUnShownNotifications = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db }, { userId }) => {
    if (!userId) {
      return null;
    }

    return db
      .query("notifications")
      .filter((q) => q.eq(q.field("hasBeenShown"), false))
      .filter((q) => q.eq(q.field("target"), userId))
      .collect();
  },
});

// or read. Was a bit tired writing this function
export const updateNotificationAsCompleted = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async ({ db }, { notificationId }) => {
    return await db.patch(notificationId, { hasBeenShown: true });
  },
});

export const createInternalNotification = internalMutation({
  args: {
    notification: v.object({
      target: v.id("users"),
      isSuccessNotification: v.boolean(),
      hasBeenShown: v.boolean(),
      message: v.string(),
    }),
  },
  handler: async ({ db }, { notification }) => {
    await db.insert("notifications", notification);
  },
});

export const createInternalNotificationAction = action({
  args: {
    notification: v.object({
      target: v.id("users"),
      isSuccessNotification: v.boolean(),
      hasBeenShown: v.boolean(),
      message: v.string(),
    }),
  },
  handler: async ({ runMutation }, { notification }) => {
    await runMutation(internal.notifications.createInternalNotification, {
      notification,
    });
  },
});
