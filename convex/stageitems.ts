import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

export const getOnStageItem = query({
  args: {},
  handler: async ({ db }, args) => {
    const stageItem = await db
      .query("stageitems")
      .filter((q) => {
        return q.eq(q.field("isOnStage"), true);
      })
      .first();

    return stageItem;
  },
});

export const addBidItemToStage = mutation({
  args: {
    bidItemId: v.id("biditems"),
    onStageDuration: v.number(),
    authorId: v.id("users"),
  },
  handler: async (
    { db, scheduler },
    { bidItemId, onStageDuration, authorId }
  ) => {
    const id = await db.insert("stageitems", {
      bidItemId: bidItemId,
      isOnStage: true,
      onStageDuration,
      author: authorId,
    });

    const user = await db.get(authorId);

    await scheduler.runAfter(0, api.messages.adminMessageAction, {
      message: `${user?.name} just added an item to the stage!`,
    });

    return id;
  },
});

export const getStageStatus = query({
  args: {},
  handler: async ({ db }) => {
    const onStageItem = await db
      .query("stageitems")
      .filter((q) => q.eq(q.field("isOnStage"), true))
      .first();

    return Boolean(onStageItem);
  },
});

export const removeItemFromStage = mutation({
  args: { stageItemId: v.id("stageitems") },
  handler: async ({ db }, { stageItemId }) => {
    await db.patch(stageItemId, {
      isOnStage: false,
    });
  },
});

export const getStageItem = query({
  args: { stageItemId: v.id("stageitems") },
  handler: async ({ db }, { stageItemId }) => {
    return await db.get(stageItemId);
  },
});

export const getNumberOfItemsOnStage = query({
  args: {},
  handler: async ({ db }) => {
    return (
      await db
        .query("stageitems")
        .filter((q) => q.eq(q.field("isOnStage"), true))
        .collect()
    ).length;
  },
});
