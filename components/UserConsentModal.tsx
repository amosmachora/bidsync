import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { BidItem } from "@/types/globals";
import { faCircleNotch, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAction, useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "react-toastify";
import { Overlay } from "./Overlay";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const UserConsentModal = ({
  close,
  bidItem,
}: {
  close: () => void;
  bidItem: BidItem;
}) => {
  const addBidItemToStage = useMutation(api.stageitems.addBidItemToStage);
  const stageStatus = useQuery(api.stageitems.getStageStatus);

  const userId = useStoreUserEffect();

  const [onStageDuration, setOnStageDuration] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (stageStatus) {
      toast.warning("An item is currently on stage");
      return;
    }

    if (!onStageDuration) {
      toast.warning("Please pick a duration");
      return;
    }
    setIsSubmitting(true);
    await addBidItemToStage({
      bidItemId: bidItem._id!,
      onStageDuration: onStageDuration!,
      authorId: userId!,
    });
    // await adminMessageAction({
    //   message: `${currentUser?.name} just added an item to the stage!`,
    // });
    setIsSubmitting(false);
  };

  return (
    <Overlay>
      <div className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md text-sm">
        <FontAwesomeIcon
          icon={faXmark}
          className="h-5 w-5 text-blue-600 ml-auto cursor-pointer absolute top-5 right-5"
          onClick={close}
        />
        <p>
          You are about to add <span className="italic">{bidItem.title}</span>{" "}
          to the stage!
        </p>
        <p>Pick the amount of time the item should be on the stage</p>
        <Select onValueChange={(value) => setOnStageDuration(parseInt(value))}>
          <SelectTrigger className="w-1/2 mx-auto">
            <SelectValue placeholder="Pick time" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Time</SelectLabel>
              <SelectItem value={(5 * 60).toString()}>5 mins</SelectItem>
              <SelectItem value={(10 * 60).toString()}>10 mins</SelectItem>
              <SelectItem value={(15 * 60).toString()}>15 mins</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          className="w-full bg-blue-500 hover:bg-blue-400"
          onClick={handleSubmit}
        >
          {isSubmitting ? (
            <FontAwesomeIcon icon={faCircleNotch} className="w-3 h-3" spin />
          ) : (
            "add to stage!"
          )}
        </Button>
      </div>
    </Overlay>
  );
};
