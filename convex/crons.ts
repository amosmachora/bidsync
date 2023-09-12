import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

const crons = cronJobs();

// crons.interval(
//   "decrease stage time",
//   { seconds: 1 },
//   internal.crons.decreaseStageTime
// );

export const decreaseStageTime = internalMutation({
  args: {},
  handler: async ({ db }, {}) => {
    const onStageItem = await db
      .query("stageitems")
      .filter((q) => {
        return q.eq(q.field("isOnStage"), true);
      })
      .first();

    if (!onStageItem) {
      return null;
    }

    if (onStageItem.onStageDuration! <= 0) {
      await db.patch(onStageItem._id, { isOnStage: false });
      return;
    }

    await db.patch(onStageItem?._id, {
      onStageDuration: onStageItem.onStageDuration! - 1,
    });
  },
});

export default crons;
