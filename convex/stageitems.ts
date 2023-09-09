import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOnStageBidItem = query({
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
  args: { bidItemId: v.id("biditems"), onStageDuration: v.number() },
  handler: async ({ db }, { bidItemId, onStageDuration }) => {
    return await db.insert("stageitems", {
      bidItemId: bidItemId,
      isOnStage: true,
      onStageDuration,
    });
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
