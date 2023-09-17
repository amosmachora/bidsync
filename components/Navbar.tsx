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
import ProfileDataSkeleton from "./ProfileDataSkeleton";
import { Skeleton } from "./ui/skeleton";
import { UserProfileButton } from "./UserProfileButton";

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
      <div className="flex items-center relative w-1/5">
        <div
          className="absolute w-max text-blue-500 cursor-pointer -left-14"
          onClick={() => setIsShowingNotifications((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
          <p className="absolute -translate-y-1/3 top-0 right-0 translate-x-full text-sm">
            {userNotifications?.length}
          </p>
        </div>
        {isShowingNotifications && (
          <Notifications close={() => setIsShowingNotifications(false)} />
        )}
        {isShowingLogOutButton && (
          <LogOutButton close={() => setIsShowingLogOutButton(false)} />
        )}
        {isLoading ? (
          <ProfileDataSkeleton />
        ) : isAuthenticated ? (
          <UserProfileButton
            showLogOutButton={() => setIsShowingLogOutButton((prev) => !prev)}
          />
        ) : (
          <div className="show px-4 py-2">
            <SignInButton mode="modal" />
          </div>
        )}
      </div>
    </div>
  );
};
