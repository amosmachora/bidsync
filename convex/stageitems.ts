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
  args: {
    bidItemId: v.id("biditems"),
    onStageDuration: v.number(),
    authorId: v.id("users"),
  },
  handler: async ({ db }, { bidItemId, onStageDuration, authorId }) => {
    return await db.insert("stageitems", {
      bidItemId: bidItemId,
      isOnStage: true,
      onStageDuration,
      author: authorId,
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

export const makeBid = mutation({
  args: {
    stageItemId: v.id("stageitems"),
    bid: v.object({ author: v.id("users"), bidAmount: v.number() }),
  },
  handler: async ({ db, scheduler }, { stageItemId, bid }) => {
    const savedStageItem = await db.get(stageItemId);

    return await db.patch(stageItemId, {
      bidHistory: [...(savedStageItem?.bidHistory ?? []), bid],
    });
  },
});

export const acceptBid = mutation({
  args: { bidWinner: v.id("users"), stageItemId: v.id("stageitems") },
  handler: async ({ auth, db, scheduler }, { bidWinner, stageItemId }) => {
    return await db.patch(stageItemId, {
      bidWinner: bidWinner,
    });
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
