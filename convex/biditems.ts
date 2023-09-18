import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const saveBidItem = mutation({
  args: {
    body: v.object({
      author: v.id("users"),
      price: v.string(),
      description: v.string(),
      title: v.string(),
      images: v.optional(v.array(v.string())),
      isSold: v.boolean(),
    }),
  },
  handler: async ({ db }, { body }) => {
    return await db.insert("biditems", body);
  },
});

export const getAllBidItems = query({
  args: {},
  handler: async ({ auth, db, storage }, {}) => {
    const biditems = await db.query("biditems").order("desc").collect();

    return biditems.reverse();
  },
});

export const addImageIdsToBidItem = internalMutation({
  args: { storageId: v.string(), bidItemId: v.id("biditems") },
  handler: async ({ db }, { storageId, bidItemId }) => {
    // const bidItem = await scheduler.runAfter(
    //   0,
    //   api.biditems.getBidItemByItemIdAction,
    //   { bidItemId }
    // );

    const bidItem = await db.get(bidItemId);

    return await db.patch(bidItemId, {
      imageStorageIds: [...(bidItem?.imageStorageIds ?? []), storageId],
    });
  },
});

export const getBidItemsByUserId = query({
  args: { userId: v.optional(v.id("users")) },
  handler: async ({ db, auth }, { userId }) => {
    const identity = auth.getUserIdentity();

    if (!identity) {
      return null;
    }

    const userBidItems = await db
      .query("biditems")
      .filter((q) => {
        return q.eq(q.field("author"), userId);
      })
      .order("desc")
      .collect();

    return userBidItems;
  },
});

export const getBidItemByItemId = query({
  args: { bidItemId: v.optional(v.id("biditems")) },
  handler: async ({ db }, { bidItemId }) => {
    if (!bidItemId) {
      return null;
    }
    return db.get(bidItemId);
  },
});

export const getSoldBidItems = query({
  args: {},
  handler: async ({ db }, {}) => {
    return await db
      .query("biditems")
      .filter((q) => q.eq(q.field("isSold"), true))
      .collect();
  },
});

export const getLatestTwoSoldItems = query({
  args: {},
  handler: async ({ db }, {}) => {
    return await db
      .query("biditems")
      .filter((q) => q.eq(q.field("isSold"), true))
      .order("desc")
      .take(2);
  },
});

// export const getBidItemByItemIdAction: RegisteredAction<
//   "public",
//   { bidItemId: Id<"biditems"> },
//   Promise<{
//     _id: Id<"biditems">;
//     _creationTime: number;
//     imageStorageIds?: string[] | undefined;
//     author: Id<"users">;
//     price: string;
//     description: string;
//     title: string;
//   } | null>
// > = action({
//   args: { bidItemId: v.id("biditems") },
//   handler: async ({ runQuery }, { bidItemId }) => {
//     const bidItem = await runQuery(internal.biditems.getBidItemByItemId, {
//       bidItemId,
//     });
//     return bidItem;
//   },
// });
