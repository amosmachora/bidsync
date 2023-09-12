import { useUser } from "@clerk/clerk-react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const UserProfileButton = ({
  showLogOutButton,
}: {
  showLogOutButton: () => void;
}) => {
  const { user } = useUser();
  return (
    <div className="flex ml-auto" onClick={showLogOutButton}>
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
  );
};
