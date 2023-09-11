"use client";

import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConvexAuth, useQuery } from "convex/react";
import { useState } from "react";
import LogOutButton from "./LogOutButton";
import { Notifications } from "./Notifications";
import { Skeleton } from "./ui/skeleton";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const userId = useStoreUserEffect();
  const userNotifications = useQuery(
    api.notifications.getAllUnShownNotifications,
    { userId: userId ?? undefined }
  );

  const [isShowingNotifications, setIsShowingNotifications] = useState(false);
  const [isShowingLogOutButton, setIsShowingLogOutButton] = useState(false);

  return (
    <div className="flex py-4 px-[3%] justify-between show">
      <div className="flex items-center show">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/crown.jpg" alt="crown" className="w-5 h-5 mr-5" />
        <p>Bidsync</p>
      </div>
      <div className="flex items-center relative">
        <div
          className="relative w-max mr-10 text-blue-500 cursor-pointer"
          onClick={() => setIsShowingNotifications((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
          <p className="absolute -translate-y-1/3 top-0 right-0 translate-x-full text-sm">
            {userNotifications?.length}
          </p>
        </div>
        {isShowingNotifications && <Notifications />}
        {isShowingLogOutButton && <LogOutButton />}
        {isLoading ? (
          <div className="flex items-center space-x-4 w-1/5">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
            </div>
          </div>
        ) : isAuthenticated ? (
          <div
            className="flex ml-auto"
            onClick={() => setIsShowingLogOutButton((prev) => !prev)}
          >
            {user?.hasImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.imageUrl}
                alt={user.fullName + `s photo`}
                className="w-10 h-10 outline outline-blue-500 outline-2 rounded-full mr-3"
              />
            ) : (
              <div className="w-10 h-10 outline outline-blue-500 outline-2 rounded-full relative  mr-3">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-5 h-5 center-absolutely"
                />
              </div>
            )}
            <div className="text-black text-sm">
              <p>{user?.fullName}</p>
              <p>{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        ) : (
          <div className="show px-4 py-2">
            <SignInButton mode="modal" />
          </div>
        )}
      </div>
    </div>
  );
};
