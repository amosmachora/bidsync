import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";
import { Button } from "./ui/button";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { MakeBidModal } from "./MakeBidModal";
import { BidHistory } from "./BidHistory";
import { StageImageCarousel } from "./StageImageCarousel";
import { Notification } from "@/types/globals";
import { toast } from "react-toastify";
import { BidStream } from "./BidStream";

export const Stage = () => {
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });
  const currentUserId = useStoreUserEffect();

  const allUnShownNotifications = useQuery(
    api.notifications.getAllUnShownNotifications,
    { userId: currentUserId ?? undefined }
  );

  useEffect(() => {
    const currentUserNotifications = allUnShownNotifications?.filter(
      (notification) => notification.target === currentUserId
    );

    if (currentUserNotifications && currentUserNotifications.length > 0) {
      const handleNotifications = async (notifications: Notification[]) => {
        for (const notification of notifications) {
          if (notification.isSuccessNotification) {
            toast.success(notification.message);
          } else {
            toast.warning(notification.message);
          }
        }
      };
      handleNotifications(currentUserNotifications);
    }
  }, [allUnShownNotifications, currentUserId]);

  return (
    <div className="w-1/2 show relative">
      {onStageItem ? (
        <div className="flex p-[2%]">
          <StageImageCarousel onStageBidItem={onStageBidItem} />
          <BidStream />
        </div>
      ) : (
        <p className="text-center center-absolutely text-sm">
          No Item is on stage! click on one of your items to add it to the
          stage! Or create one if you don`t have any!
        </p>
      )}
    </div>
  );
};
