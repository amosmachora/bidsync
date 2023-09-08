import { Id } from "@/convex/_generated/dataModel";

export type BidItem = {
  author: Id<"users">;
  price: string;
  description: string;
  title: string;
  imageStorageIds?: string[];
};
