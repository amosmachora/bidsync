import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { minsAndSecs } from "@/lib/utils";
import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction, useMutation, useQuery } from "convex/react";
import { OpenDirOptions } from "fs";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { Overlay } from "./Overlay";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export const MakeBidModal = ({
  stageItemId,
  close,
}: {
  stageItemId: Id<"stageitems">;
  close: () => void;
}) => {
  const makeBidMutation = useMutation(api.stageitems.makeBid);
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const adminMessageAction = useAction(api.messages.adminMessageAction);
  const currentUserId = useStoreUserEffect();
  const currentUser = useQuery(api.users.getUser, {
    userId: currentUserId ?? undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const makeBid = async (e: FormEvent) => {
    const formData = new FormData(e.target as HTMLFormElement);
    e.preventDefault();
    setIsSubmitting(true);
    const bidAmount = parseInt(formData.get("bid-amount") as unknown as string);
    await makeBidMutation({
      bid: {
        author: currentUserId!,
        bidAmount: bidAmount,
        status: "pending",
      },
      stageItemId: stageItemId,
    });
    await adminMessageAction({
      message: `${currentUser?.name} just made a bid of ${bidAmount} USD!`,
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
        <p>{minsAndSecs(onStageItem?.onStageDuration)} remaining!</p>
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
