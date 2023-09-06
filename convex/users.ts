import { mutation } from "./_generated/server";

export const storeUser = mutation({
  args: {},
  handler: async ({ auth, db }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const user = await db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .unique();

    if (user !== null) {
      if (user.name !== identity.name) {
        await db.patch(user._id, { name: identity.name });
      }
      return user._id;
    }

    return await db.insert("users", {
      name: identity.name!,
      tokenIdentifier: identity.tokenIdentifier,
      imageUrl: identity.pictureUrl!,
    });
  },
});
