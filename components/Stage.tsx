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

export const Stage = () => {
  const userCount = useQuery(api.users.userCount);
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });
  const allUnShownNotifications = useQuery(
    api.notifications.getAllUnShownNotifications
  );
  const markNotificationAsShown = useMutation(
    api.notifications.updateNotificationAsCompleted
  );

  const [timer, setTimer] = useState(onStageItem?.onStageDuration ?? 0);
  const [isShowingMakeBidModal, setIsShowingMakeBidModal] = useState(false);

  useEffect(() => {
    if (onStageItem?.onStageDuration) {
      const id = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [onStageItem]);

  useEffect(() => {
    if (onStageItem?.onStageDuration) {
      setTimer(onStageItem.onStageDuration);
    }
  }, [onStageItem]);

  const currentUserId = useStoreUserEffect();

  const isCurrentUsersItemBeingBidOn: boolean =
    currentUserId === onStageBidItem?.author;

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

          // Wait for approximately 10 seconds (10,000 milliseconds) before marking as shown
          await new Promise((resolve) => setTimeout(resolve, 10000));
          await markNotificationAsShown({ notificationId: notification._id });
        }
      };
      handleNotifications(currentUserNotifications);
    }
  }, [allUnShownNotifications, currentUserId, markNotificationAsShown]);
  return (
    <div className="show h-1/2 relative">
      <p className="text-white bg-blue-500 rounded-b-sm absolute top-o right-0 w-max p-3 text-xs">
        {userCount} AU
      </p>
      {onStageItem ? (
        <div className="flex p-[2%] h-full">
          <StageImageCarousel
            imageStorageIds={onStageBidItem?.imageStorageIds}
          />
          <div className="px-[2%] flex-grow flex flex-col show">
            <p className="text-center mb-2">{minsAndSecs(timer)}</p>
            <p>{onStageBidItem?.price}</p>
            <p>{onStageBidItem?.title}</p>
            <p>{onStageBidItem?.description}</p>
            <BidHistory />
            {!isCurrentUsersItemBeingBidOn && (
              <Button
                className="w-full mt-auto bg-green-500 hover:bg-green-400"
                onClick={() => setIsShowingMakeBidModal(true)}
              >
                Bid on this item
              </Button>
            )}
          </div>
          {isShowingMakeBidModal && (
            <MakeBidModal
              timer={timer}
              stageItemId={onStageItem._id}
              close={() => setIsShowingMakeBidModal(false)}
            />
          )}
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

const minsAndSecs = (secs: number): string => {
  return `${Math.floor(secs / 60)
    .toString()
    .padStart(2, "0")}:${(secs % 60).toString().padStart(2, "0")}`;
};
