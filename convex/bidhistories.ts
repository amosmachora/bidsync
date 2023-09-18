import { v } from "convex/values";
import { api, internal } from "./_generated/api";
import { mutation, query } from "./_generated/server";

export const makeBid = mutation({
  args: {
    bid: v.object({
      isBidWinner: v.optional(v.boolean()),
      bidder: v.id("users"),
      bidAmount: v.number(),
      itemId: v.id("biditems"),
      stageItem: v.id("stageitems"),
      status: v.string(),
      _id: v.optional(v.id("bidhistories")),
      _creationTime: v.optional(v.number()),
    }),
  },
  handler: async ({ db, scheduler }, { bid }) => {
    const insertId = await db.insert("bidhistories", bid);
    const user = await db.get(bid.bidder);

    await scheduler.runAfter(0, api.messages.adminMessageAction, {
      message: `${user?.name} just made a bid of ${bid.bidAmount} USD!`,
    });

    return insertId;
  },
});

export const acceptBid = mutation({
  args: {
    bid: v.object({
      isBidWinner: v.optional(v.boolean()),
      bidder: v.id("users"),
      bidAmount: v.number(),
      itemId: v.id("biditems"),
      stageItem: v.id("stageitems"),
      status: v.string(),
      _id: v.id("bidhistories"),
      _creationTime: v.optional(v.number()),
    }),
  },
  handler: async ({ db, scheduler }, { bid }) => {
    await db.patch(bid.itemId, {
      isSold: true,
    });

    await db.patch(bid._id, {
      isBidWinner: true,
      status: "accepted",
    });

    // create notification
    await scheduler.runAfter(
      0,
      internal.notifications.createInternalNotification,
      {
        notification: {
          hasBeenShown: false,
          isSuccessNotification: true,
          message: `Your bid of ${bid.bidAmount} was accepted`,
          target: bid.bidder,
          isRead: false,
        },
      }
    );

    const bidAuthor = await db.get(bid.bidder);

    //send admin message
    await scheduler.runAfter(0, api.messages.adminMessageAction, {
      message: `${bidAuthor?.name} won the bid!`,
    });

    const allOtherBids = await db
      .query("bidhistories")
      .filter((q) => q.eq(q.field("stageItem"), bid.stageItem))
      .filter((q) => q.neq(q.field("_id"), bid._id))
      .filter((q) => q.neq(q.field("status"), "declined"))
      .collect();

    for (const bid of allOtherBids) {
      await db.patch(bid._id, { isBidWinner: false, status: "outbid" });
      //push notification to losers
      await scheduler.runAfter(
        0,
        internal.notifications.createInternalNotification,
        {
          notification: {
            hasBeenShown: false,
            isSuccessNotification: false,
            message: "You were outbid :-(",
            target: bid.bidder,
            isRead: false,
          },
        }
      );
    }
  },
});

export const declineBid = mutation({
  args: {
    bid: v.object({
      isBidWinner: v.optional(v.boolean()),
      bidder: v.id("users"),
      bidAmount: v.number(),
      itemId: v.id("biditems"),
      stageItem: v.id("stageitems"),
      status: v.string(),
      _id: v.id("bidhistories"),
      _creationTime: v.optional(v.number()),
    }),
  },
  handler: async ({ db, scheduler }, { bid }) => {
    await db.patch(bid._id, { status: "declined" });
    // notify the bloody looser
    scheduler.runAfter(0, internal.notifications.createInternalNotification, {
      notification: {
        hasBeenShown: false,
        isSuccessNotification: false,
        message: `Your bid of ${bid.bidAmount} USD was denied`,
        target: bid.bidder,
        isRead: false,
      },
    });
  },
});

export const getAllBidsByStageItemId = query({
  args: { stageItemId: v.optional(v.id("stageitems")) },
  handler: async ({ db }, { stageItemId }) => {
    if (!stageItemId) {
      return null;
    }

    return await db
      .query("bidhistories")
      .filter((q) => q.eq(q.field("stageItem"), stageItemId))
      .collect();
  },
});

export const getBidHistoryByBidItemId = query({
  args: { itemId: v.optional(v.id("biditems")) },
  handler: async ({ db }, { itemId }) => {
    if (!itemId) {
      return null;
    }
    return (
      await db
        .query("bidhistories")
        .filter((q) => q.eq(q.field("itemId"), itemId))
        .collect()
    ).reverse();
  },
});

export const getUserBidHistory = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db }, { userId }) => {
    if (!userId) {
      return null;
    }

    return await db
      .query("bidhistories")
      .filter((q) => q.eq(q.field("bidder"), userId))
      .collect();
  },
});
