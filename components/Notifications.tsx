import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useMutation, useQuery } from "convex/react";
import React from "react";
import { CloseModal } from "./CloseModal";

export const Notifications = ({ close }: { close: () => void }) => {
  const userId = useStoreUserEffect();
  const userNotifications = useQuery(api.notifications.getAllNotifications, {
    userId: userId ?? undefined,
  });
  const markNotificationAsRead = useMutation(
    api.notifications.markNotificationAsRead
  );

  console.log(userNotifications);

  return (
    <>
      <div className="absolute -bottom-4 translate-y-full bg-white rounded-md show p-5 w-full shadow-md z-50 max-h-[50vh] overflow-y-auto">
        <p className="mb-5">Notifications</p>
        {userNotifications?.map((notification) => (
          <div
            key={notification._id}
            className="flex items-center justify-between"
          >
            <p className="w-3/4 text-sm">{notification.message}</p>
            {!notification.isRead && (
              <FontAwesomeIcon
                icon={faCheck}
                className="w-5 h-5 text-green-600 cursor-pointer"
                onClick={async () =>
                  await markNotificationAsRead({
                    notificationId: notification._id,
                  })
                }
              />
            )}
          </div>
        ))}
      </div>
      <CloseModal close={close} />
    </>
  );
};
