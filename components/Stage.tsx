import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import Carousel from "nuka-carousel";
import { Button } from "./ui/button";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { MakeBidModal } from "./MakeBidModal";
import { StageImageCarousel } from "./StageImageCarousel";
import { Notification } from "@/types/globals";
import { toast } from "react-toastify";
import { BidStream } from "./BidStream";
import { StageAction } from "./StageAction";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useGlobalData } from "@/hooks/useGlobalData";

export const Stage = () => {
  const {
    setIsShowingAddBidItemModal,
    currentItemIdx,
    setCurrentItemIdx,
    onStageItem,
    setUserProfileId,
  } = useGlobalData();
  const currentUserId = useStoreUserEffect();

  const stageItemAuthor = useQuery(api.users.getUser, {
    userId: onStageItem?.author,
  });

  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });
  const numberOfOnStageItems = useQuery(api.stageitems.getNumberOfItemsOnStage);
  const allUnShownNotifications = useQuery(
    api.notifications.getAllUnShownNotifications,
    { userId: currentUserId ?? undefined }
  );
  const markNotificationAsShown = useMutation(
    api.notifications.markNotificationAsShown
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
          await markNotificationAsShown({ notificationId: notification._id });
        }
      };
      handleNotifications(currentUserNotifications);
    }
  }, [allUnShownNotifications, currentUserId, markNotificationAsShown]);

  console.log(currentItemIdx);

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center">
        <p className="font-semibold">Items on auction</p>
        <div className="flex items-center gap-x-3">
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              currentItemIdx === 0 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => {
              if (currentItemIdx !== 0) {
                setCurrentItemIdx((prev) => prev - 1);
              }
            }}
          >
            <path
              d="M9.53073 15.9694C9.60041 16.039 9.65568 16.1218 9.6934 16.2128C9.73111 16.3039 9.75052 16.4014 9.75052 16.5C9.75052 16.5985 9.73111 16.6961 9.6934 16.7872C9.65568 16.8782 9.60041 16.9609 9.53073 17.0306C9.46104 17.1003 9.37832 17.1556 9.28727 17.1933C9.19623 17.231 9.09865 17.2504 9.0001 17.2504C8.90156 17.2504 8.80397 17.231 8.71293 17.1933C8.62188 17.1556 8.53916 17.1003 8.46948 17.0306L0.969476 9.53061C0.899744 9.46096 0.844425 9.37824 0.806682 9.28719C0.768939 9.19614 0.749512 9.09855 0.749512 8.99999C0.749512 8.90143 0.768939 8.80383 0.806682 8.71278C0.844425 8.62173 0.899744 8.53902 0.969476 8.46936L8.46948 0.969365C8.61021 0.828634 8.80108 0.749573 9.0001 0.749573C9.19912 0.749573 9.39 0.828634 9.53073 0.969365C9.67146 1.1101 9.75052 1.30097 9.75052 1.49999C9.75052 1.69901 9.67146 1.88988 9.53073 2.03061L2.56041 8.99999L9.53073 15.9694Z"
              fill="#2D2B2B"
            />
          </svg>
          <span className="text-sm font-medium">
            {currentItemIdx + 1}/{numberOfOnStageItems ?? 0}
          </span>
          <svg
            width="10"
            height="18"
            viewBox="0 0 10 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={`${
              currentItemIdx + 1 === numberOfOnStageItems || !onStageItem
                ? "cursor-not-allowed"
                : "cursor-pointer "
            }`}
            onClick={() => {
              if (currentItemIdx + 1 !== numberOfOnStageItems) {
                setCurrentItemIdx((prev) => prev + 1);
              }
            }}
          >
            <path
              d="M9.03055 9.53061L1.53055 17.0306C1.46087 17.1003 1.37815 17.1556 1.2871 17.1933C1.19606 17.231 1.09847 17.2504 0.999929 17.2504C0.901383 17.2504 0.803801 17.231 0.712756 17.1933C0.621712 17.1556 0.538986 17.1003 0.469303 17.0306C0.399621 16.9609 0.344345 16.8782 0.306633 16.7872C0.268921 16.6961 0.249512 16.5985 0.249512 16.5C0.249512 16.4014 0.268921 16.3039 0.306633 16.2128C0.344345 16.1218 0.399621 16.039 0.469303 15.9694L7.43962 8.99999L0.469303 2.03061C0.328573 1.88988 0.249512 1.69901 0.249512 1.49999C0.249512 1.30097 0.328573 1.1101 0.469303 0.969365C0.610034 0.828634 0.800906 0.749573 0.999929 0.749573C1.19895 0.749573 1.38982 0.828634 1.53055 0.969365L9.03055 8.46936C9.10029 8.53902 9.15561 8.62174 9.19335 8.71278C9.23109 8.80383 9.25052 8.90143 9.25052 8.99999C9.25052 9.09855 9.23109 9.19615 9.19335 9.28719C9.15561 9.37824 9.10029 9.46096 9.03055 9.53061Z"
              fill="#2D2B2B"
            />
          </svg>
        </div>
      </div>
      {onStageItem ? (
        <div className="flex bg-white mt-2 p-5 rounded-md justify-between gap-x-3">
          <StageImageCarousel onStageBidItem={onStageBidItem} />
          <div className="w-1/2 flex flex-col">
            <div
              className="flex text-sm mb-5 text-[#545454] cursor-pointer"
              onClick={() => setUserProfileId(stageItemAuthor?._id ?? null)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={stageItemAuthor?.imageUrl}
                alt=""
                className="w-5 h-5 rounded-full mr-1"
              />
              <p>{stageItemAuthor?.name}</p>
            </div>
            <p className="font-medium">{onStageBidItem?.title}</p>
            <p className="uppercase font-bold text-2xl">
              {onStageBidItem?.price}{" "}
              {!onStageBidItem?.price.includes("usd") &&
                !onStageBidItem?.price.includes("USD") &&
                "USD"}
            </p>
            <p className="text-xs text-[#9B9B9B] line-clamp-2">
              {onStageBidItem?.description}
            </p>
            {/* <p className="mt-4 text-[#545454] font-semibold">Attributes</p> */}
            <StageAction />
          </div>
        </div>
      ) : (
        <div className="bg-white my-6 p-5 rounded-md justify-between gap-x-3">
          <p className="text-center text-sm">
            No Item is on stage! Click on the add item button to add one!
          </p>
          <div
            className="text-semibold py-3 border rounded text-center border-[#E03636] border-dashed mt-5 cursor-pointer font-semibold text-sm flex items-center justify-center w-1/2 mx-auto"
            onClick={() => setIsShowingAddBidItemModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" />
            Add item
          </div>
        </div>
      )}
    </div>
  );
};
