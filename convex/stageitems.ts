import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { action, internalMutation, mutation, query } from "./_generated/server";

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

    // await scheduler.runAfter(0, api.stageitems.decreaseStageTimeAction, {
    //   stageItemId: id,
    // });

    return id;
  },
});

export const decreaseStageTime = mutation({
  args: { stageItemId: v.id("stageitems") },
  handler: async ({ db }, { stageItemId }) => {
    const stageItem = await db.get(stageItemId);

    if (stageItem!.onStageDuration! <= 0) {
      await db.patch(stageItemId, { isOnStage: false });
      return;
    }

    await db.patch(stageItemId, {
      onStageDuration: stageItem!.onStageDuration! - 1,
    });
  },
});

// export const decreaseStageTimeAction = action({
//   args: { stageItemId: v.id("stageitems") },
//   handler: async ({ runMutation }, { stageItemId }) => {
//     setInterval(async () => {
//       runMutation(internal.stageitems.decreaseStageTime, {
//         stageItemId,
//       });
//     }, 1000);
//   },
// });

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
