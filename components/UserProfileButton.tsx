import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { useUser } from "@clerk/clerk-react";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import React, { useState } from "react";
import LogOutButton from "./LogOutButton";
import { Notifications } from "./Notifications";

export const UserProfileButton = () => {
  const { user } = useUser();
  const [isShowingNotifications, setIsShowingNotifications] = useState(false);
  const [isShowingLogOutButton, setIsShowingLogOutButton] = useState(false);

  const userId = useStoreUserEffect();
  const userNotifications = useQuery(
    api.notifications.getAllUnShownNotifications,
    { userId: userId ?? undefined }
  );
  return (
    <div className="flex ml-auto items-center relative">
      <div
        className="mr-6 relative cursor-pointer"
        onClick={() => setIsShowingNotifications((prev) => !prev)}
      >
        {(userNotifications?.length ?? 0) > 0 && (
          <div className="bg-red-500 w-1 h-1 rounded-full absolute top-0 right-0" />
        )}
        <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
      </div>
      <div
        className="flex items-center"
        onClick={() => setIsShowingLogOutButton(false)}
      >
        {user?.hasImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt={user.fullName + `s photo`}
            className="w-10 h-10 rounded-full mr-3"
          />
        ) : (
          <div className="w-10 h-10 outline outline-blue-500 outline-2 rounded-full relative  mr-3">
            <FontAwesomeIcon
              icon={faUser}
              className="w-5 h-5 center-absolutely"
            />
          </div>
        )}
        <div className="text-black text-xs">
          <p>{user?.fullName}</p>
          <p>{user?.primaryEmailAddress?.emailAddress}</p>
        </div>
      </div>
      {isShowingNotifications && (
        <Notifications close={() => setIsShowingNotifications(false)} />
      )}
      {isShowingLogOutButton && (
        <LogOutButton close={() => setIsShowingLogOutButton(false)} />
      )}
    </div>
  );
};
