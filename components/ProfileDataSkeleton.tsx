import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Skeleton } from "./ui/skeleton";

const ProfileDataSkeleton = () => {
  return (
    <div className="flex ml-auto items-center w-1/5">
      <div className="mr-6 relative">
        <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
      </div>
      <div className="flex items-center space-x-4 w-4/5 ml-auto">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-grow">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default ProfileDataSkeleton;
