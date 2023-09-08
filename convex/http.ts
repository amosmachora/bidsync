import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/uploadImage",
  method: "POST",
  handler: httpAction(async ({ storage, runMutation }, request) => {
    // Step 1: Store the file
    const blob = await request.blob();
    const storageId = await storage.store(blob);

    const bidItemId = new URL(request.url).searchParams.get(
      "bidItemId"
    ) as Id<"biditems">;
    await runMutation(internal.biditems.addImageIdsToBidItem, {
      storageId,
      bidItemId,
    });

    return new Response(null, {
      status: 200,
      statusText: `Successfully posted an image with id ${storageId}`,
      headers: new Headers({
        "Access-Control-Allow-Origin": process.env.CLIENT_ORIGIN!,
        Vary: "origin",
      }),
    });
  }),
});

http.route({
  path: "/getImage",
  method: "GET",
  handler: httpAction(async ({ storage }, request) => {
    const { searchParams } = new URL(request.url);
    const storageId = searchParams.get("storageId");
    const blob = await storage.get(storageId!);
    if (!blob) {
      return new Response("Image not found", {
        status: 404,
      });
    }

    return new Response(blob);
  }),
});

export default http;
