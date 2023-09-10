import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    target: v.id("users"),
    isSuccessNotification: v.boolean(),
    hasBeenShown: v.boolean(),
    message: v.string(),
  },
  handler: async (
    { db },
    { isSuccessNotification, target, hasBeenShown, message }
  ) => {
    await db.insert("notifications", {
      isSuccessNotification,
      target,
      hasBeenShown,
      message,
    });
  },
});

export const getAllNotifications = query({
  args: {},
  handler: async ({ db }) => {
    return db.query("notifications").collect();
  },
});

export const getAllUnShownNotifications = query({
  args: {},
  handler: async ({ db }) => {
    return db
      .query("notifications")
      .filter((q) => q.eq(q.field("hasBeenShown"), false))
      .collect();
  },
});

export const updateNotificationAsCompleted = mutation({
  args: { notificationId: v.id("notifications") },
  handler: async ({ db }, { notificationId }) => {
    return await db.patch(notificationId, { hasBeenShown: true });
  },
});
