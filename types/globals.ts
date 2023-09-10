import { Id } from "@/convex/_generated/dataModel";

export type BidItem = {
  author: Id<"users">;
  price: string;
  description: string;
  title: string;
  imageStorageIds?: string[];
  isOnStage?: boolean;
  _id?: Id<"biditems">;
};

export type Notification = {
  _id: Id<"notifications">;
  _creationTime: number;
  target: Id<"users">;
  isSuccessNotification: boolean;
  hasBeenShown: boolean;
  message: string;
};
