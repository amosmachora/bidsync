import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Carousel from "nuka-carousel";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

export const Stage = () => {
  const userCount = useQuery(api.users.userCount);
  /**
   * TODO Probably run how to call a query from a query
   */
  const onStageItem = useQuery(api.stageitems.getOnStageBidItem);
  const onStageBidItem = useQuery(api.biditems.getBidItemByItemId, {
    bidItemId: onStageItem?.bidItemId,
  });

  const [timer, setTimer] = useState(onStageItem?.onStageDuration ?? 0);

  useEffect(() => {
    if (onStageItem?.onStageDuration) {
      const id = setInterval(() => {
        setTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(id);
    }
  }, [onStageItem]);

  useEffect(() => {
    if (onStageItem?.onStageDuration) {
      setTimer(onStageItem.onStageDuration);
    }
  }, [onStageItem]);

  return (
    <div className="show h-1/2 relative">
      <p className="text-white bg-blue-500 rounded-b-sm absolute top-o right-0 w-max p-3 text-xs">
        {userCount} AU
      </p>
      {onStageItem ? (
        <div className="flex p-[2%] h-full">
          <div className="w-1/2 h-full">
            <Carousel className="h-full">
              {onStageBidItem?.imageStorageIds?.map((id) => {
                const getImageUrl = new URL(
                  `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
                );
                getImageUrl.searchParams.set("storageId", id);

                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl.href}
                    alt=""
                    key={id}
                    className="w-full aspect-video object-cover h-full"
                  />
                );
              })}
            </Carousel>
          </div>
          <div className="px-[2%] flex-grow flex flex-col">
            <p className="text-center mb-2">{minsAndSecs(timer)}</p>
            <p>{onStageBidItem?.price}</p>
            <p>{onStageBidItem?.title}</p>
            <p>{onStageBidItem?.description}</p>
            <Button className="w-full mt-auto bg-green-500 hover:bg-green-400">
              Bid On this Item
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center center-absolutely text-sm">
          No Item is on stage! click on one of your items to add it to the
          stage! Or create one if you don`t have any!
        </p>
      )}
    </div>
  );
};

const minsAndSecs = (secs: number): string => {
  return `${Math.floor(secs / 60)}:${secs % 60}`;
};
