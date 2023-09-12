import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

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

export const makeBid = mutation({
  args: {
    stageItemId: v.id("stageitems"),
    bid: v.object({
      author: v.id("users"),
      bidAmount: v.number(),
      status: v.string(),
    }),
  },
  handler: async ({ db, scheduler }, { stageItemId, bid }) => {
    const savedStageItem = await db.get(stageItemId);

    return await db.patch(stageItemId, {
      bidHistory: [...(savedStageItem?.bidHistory ?? []), bid],
    });
  },
});

export const acceptBid = mutation({
  args: {
    bidWinner: v.id("users"),
    stageItemId: v.id("stageitems"),
    bidId: v.id("biditems"),
    bidAmount: v.number(),
  },
  handler: async (
    { auth, db, scheduler },
    { bidWinner, stageItemId, bidId, bidAmount }
  ) => {
    const stageItem = await db.get(stageItemId);

    const otherBids = stageItem?.bidHistory?.filter(
      (bid) => bid.bidAmount !== bidAmount
    )!;
    const updatedAsOutbidBids = [];

    for (const bid of otherBids) {
      updatedAsOutbidBids.push({ ...bid, status: "outbid" });
    }

    const bid = stageItem?.bidHistory?.find(
      (bid) => bid.bidAmount === bidAmount
    )!;

    await db.patch(bidId, {
      isSold: true,
    });
    await db.patch(stageItemId, {
      bidWinner: bidWinner,
      bidHistory: [{ ...bid, status: "accepted" }, ...updatedAsOutbidBids],
    });
  },
});

export const declineBid = mutation({
  args: {
    stageItemId: v.id("stageitems"),
    bidAmount: v.number(),
  },
  handler: async ({ db }, { stageItemId, bidAmount }) => {
    const stageItem = await db.get(stageItemId);
    const otherBids = stageItem?.bidHistory?.filter(
      (bid) => bid.bidAmount !== bidAmount
    )!;
    const bid = stageItem?.bidHistory?.find(
      (bid) => bid.bidAmount === bidAmount
    )!;

    return await db.patch(stageItemId, {
      bidHistory: [...otherBids, { ...bid, status: "declined" }],
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
