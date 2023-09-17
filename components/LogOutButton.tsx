import { SignOutButton } from "@clerk/clerk-react";
import React from "react";
import { CloseModal } from "./CloseModal";

const LogOutButton = ({ close }: { close: () => void }) => {
  return (
    <>
      <div className="absolute -bottom-4 translate-y-full bg-white rounded-md show p-5 w-full shadow-md text-blue-500 z-50">
        <SignOutButton />
      </div>
      <CloseModal close={close} />
    </>
  );
};

export default LogOutButton;
