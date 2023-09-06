"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { SignInButton, SignOutButton, useUser } from "@clerk/clerk-react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConvexAuth, useMutation } from "convex/react";
import React, { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

export const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const storeUser = useMutation(api.users.storeUser);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return (
    <div className="flex py-4 px-[5%] justify-between show">
      <div className="flex items-center show">
        <p className="mr-5">L</p>
        <p>Bidsync</p>
      </div>
      {isLoading ? (
        <div className="flex items-center space-x-4 w-1/5">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2 flex-grow">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ) : isAuthenticated ? (
        <div className="flex ml-auto mr-5">
          <div className="text-black text-sm mr-3">
            <p>{user?.fullName}</p>
            <p>{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
          {user?.hasImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.imageUrl}
              alt={user.fullName + `s photo`}
              className="w-10 h-10 outline outline-blue-500 outline-2 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 outline outline-blue-500 outline-2 rounded-full relative">
              <FontAwesomeIcon
                icon={faUser}
                className="w-5 h-5 center-absolutely"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="show px-4 py-2">
          <SignInButton mode="modal" />
        </div>
      )}
      {isAuthenticated && <SignOutButton />}
    </div>
  );
};
