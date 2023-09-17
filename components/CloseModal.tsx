import React from "react";

export const CloseModal = ({
  children,
  close,
}: {
  children?: React.ReactNode;
  close?: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-20"
      onClick={close}
    >
      {children}
    </div>
  );
};
