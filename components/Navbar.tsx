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
  return (
    <div className="flex py-5 items-center border-b border-b-[#FFEFF2]">
      {isLoading ? (
        <ProfileDataSkeleton />
      ) : isAuthenticated ? (
        <UserProfileButton />
      ) : (
        <div className="show px-4 py-2 ml-auto">
          <SignInButton mode="modal" />
        </div>
      )}
    </div>
  );
};
