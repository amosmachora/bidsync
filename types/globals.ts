import { Id } from "@/convex/_generated/dataModel";

export type BidItem = {
  author: Id<"users">;
  price: string;
  description: string;
  title: string;
  imageStorageIds?: string[];
  isOnStage?: boolean;
  _id?: Id<"biditems">;
  isSold?: boolean;
};

export type Notification = {
  _id: Id<"notifications">;
  _creationTime: number;
  target: Id<"users">;
  isSuccessNotification: boolean;
  hasBeenShown: boolean;
  message: string;
};

export type BidHistory = {
  isBidWinner?: boolean;
  bidder: Id<"users">;
  bidAmount: number;
  itemId: Id<"biditems">;
  stageItem: Id<"stageitems">;
  status: string;
  _id: Id<"bidhistories">;
};

export type Message = {
  _id: Id<"messages">;
  _creationTime: number;
  author?: Id<"users"> | undefined;
  isWelcomingMessage?: boolean | undefined;
  isAdminMessage?: boolean | undefined;
  body: string;
};

export type Status = "declined" | "accepted" | "outbid" | "pending";
