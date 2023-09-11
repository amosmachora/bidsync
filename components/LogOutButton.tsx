import { SignOutButton } from "@clerk/clerk-react";
import React from "react";

const LogOutButton = () => {
  return (
    <div className="absolute -bottom-4 translate-y-full bg-white rounded-md show p-5 w-full shadow-md text-blue-500 z-50">
      <SignOutButton />
    </div>
  );
};

export default LogOutButton;
