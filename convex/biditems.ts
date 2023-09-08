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

// export const getBidItemByItemId = query({
//   args: { bidItemId: v.id("biditems") },
//   handler: async ({ db }, { bidItemId }) => {
//     return db.get(bidItemId);
//   },
// });

// export const getBidItemByItemIdAction = action({
//   args: { bidItemId: v.id("biditems") },
//   handler: async ({ runQuery }, { bidItemId }) => {
//     const bidItem = await runQuery(internal.biditems.getBidItemByItemId, {
//       bidItemId,
//     });

//     return bidItem;
//   },
// });
