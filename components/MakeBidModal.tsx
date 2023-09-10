import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation } from "convex/react";
import { OpenDirOptions } from "fs";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Overlay } from "./Overlay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const MakeBidModal = ({
  timer,
  stageItemId,
  close,
}: {
  timer: number;
  stageItemId: Id<"stageitems">;
  close: () => void;
}) => {
  const makeBidMutation = useMutation(api.stageitems.makeBid);
  const currentUserId = useStoreUserEffect();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const makeBid = async (e: FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    e.preventDefault();
    setIsSubmitting(true);
    await makeBidMutation({
      bid: {
        author: currentUserId!,
        bidAmount: parseInt(formData.get("bid-amount") as unknown as string),
      },
      stageItemId: stageItemId,
    });
    setIsSubmitting(false);
    toast.success("Your bid has been placed!");
  };

  return (
    <Overlay>
      <form
        className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md"
        onSubmit={makeBid}
      >
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 text-blue-600 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <p>Latest bid: Not Bid Yet</p>
        <p>{minsAndSecs(timer)} remaining!</p>
        <div className="w-1/2 mx-auto mt-5">
          <Input
            type="number"
            placeholder="enter bid amount"
            name="bid-amount"
            required
          />
          <Button className="bg-blue-500 hover:bg-blue-400 w-full mt-3">
            {isSubmitting ? (
              <FontAwesomeIcon icon={faCircleNotch} className="w-3 h-3" spin />
            ) : (
              "Bid 🎊"
            )}
          </Button>
        </div>
      </form>
    </Overlay>
  );
};

const minsAndSecs = (secs: number): string => {
  return `${Math.floor(secs / 60)}:${secs % 60}`;
};
