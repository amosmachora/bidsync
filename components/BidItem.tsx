import { useGlobalData } from "@/hooks/useGlobalData";
import { BidItem as BidItemType } from "@/types/globals";
import {
  faCircleNotch,
  faClockRotateLeft,
  faEllipsisVertical,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormEvent, useEffect, useState } from "react";
import { ItemHistory } from "./ItemHistory";
import { Overlay } from "./Overlay";
import UserProfileData from "./UserProfileData";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";

export const BidItem = ({
  item,
  minimized,
}: {
  item: BidItemType;
  minimized?: boolean;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isShowingItemHistory, setIsShowingItemHistory] = useState(false);
  const [isReAddingItemToStage, setIsReAddingItemToStage] = useState(false);
  const [onStageDuration, setOnStageDuration] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addBidItemToStage = useMutation(api.stageitems.addBidItemToStage);
  const userId = useStoreUserEffect();

  useEffect(() => {
    const firstStorageId = item.imageStorageIds?.at(0);
    if (firstStorageId) {
      const getImageUrl = new URL(
        `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
      );
      getImageUrl.searchParams.set("storageId", firstStorageId);

      setImageUrl(getImageUrl.href);
    }
  }, [item.imageStorageIds]);

  const handleAddItemToStage = async (e: FormEvent) => {
    e.preventDefault();

    if (!onStageDuration) {
      toast.warning("Please pick a duration");
      return;
    }
    setIsSubmitting(true);
    await addBidItemToStage({
      bidItemId: item._id!,
      onStageDuration: onStageDuration!,
      authorId: userId!,
    });
    setIsSubmitting(false);
  };

  return (
    <div
      className={`bg-white p-3 rounded text-sm cursor-pointer relative ${
        minimized ? "w-1/2 pb-5" : "w-1/4 pb-10"
      }`}
    >
      <div className={`${!minimized && "flex flex-col gap-y-3"}`}>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt=""
            className="w-full h-[120px] mb-5 object-cover rounded"
          />
        )}
        <p className="text-[#9B9B9B] text-xs">{item.title}</p>
        <p className="line-clamp-1 text-[#545454]">{item.description}</p>
        <p className="text-[#3D3B3B] font-semibold text-2xl uppercase">
          {item.price}{" "}
          {!item.price.includes("usd") && !item.price.includes("USD") && "USD"}
        </p>
      </div>
      {item.author === userId && !minimized && (
        <p
          className="absolute left-3 bottom-3 text-green-500 mt-5"
          onClick={() => setIsReAddingItemToStage(true)}
        >
          Restage
        </p>
      )}
      {item.isSold && (
        <FontAwesomeIcon
          icon={faClockRotateLeft}
          className="absolute right-3 bottom-3"
          onClick={() => setIsShowingItemHistory(true)}
        />
      )}
      {isShowingItemHistory && (
        <ItemHistory item={item} close={() => setIsShowingItemHistory(false)} />
      )}
      {isReAddingItemToStage && (
        <Overlay>
          <form
            className="gap-y-5 flex flex-col fixed top-1/2 z-50 -translate-y-1/2 rounded-md bg-white p-[3%] w-10/12 sm:w-1/2 left-1/2 -translate-x-1/2 shadow-md"
            onSubmit={handleAddItemToStage}
          >
            <FontAwesomeIcon
              icon={faXmark}
              className="h-5 w-5 ml-auto cursor-pointer absolute top-5 right-5"
              onClick={() => setIsReAddingItemToStage(false)}
            />
            <h1 className="font-semibold mb-5 text-xl">Select time</h1>
            <p className="text-sm">
              Select the amount of time the item should be on the stage
            </p>
            <Select
              onValueChange={(value) => setOnStageDuration(parseInt(value))}
              required
            >
              <SelectTrigger className="w-full mx-auto">
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
              className="bg-[#E03636] text-white hover:bg-red-400"
              type="submit"
            >
              {isSubmitting ? (
                <FontAwesomeIcon
                  icon={faCircleNotch}
                  spin
                  className="w-3 h-3 mx-auto"
                />
              ) : (
                "Done"
              )}
            </Button>
          </form>
        </Overlay>
      )}
    </div>
  );
};
