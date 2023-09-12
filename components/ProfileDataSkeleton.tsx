import React from "react";
import { Skeleton } from "./ui/skeleton";

const ProfileDataSkeleton = () => {
  return (
    <div className="flex items-center space-x-4 w-4/5">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2 flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};

export default ProfileDataSkeleton;
