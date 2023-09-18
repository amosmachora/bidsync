import React from "react";
import Carousel from "nuka-carousel";
import { BidItem } from "@/types/globals";

export const StageImageCarousel = ({
  onStageBidItem,
}: {
  onStageBidItem?: BidItem | null;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`);
  url.searchParams.set("storageId", onStageBidItem?.imageStorageIds?.at(0)!);
  return (
    <div className="w-1/2 overflow-hidden">
      {/* <Carousel
        enableKeyboardControls
        wrapAround
        defaultControlsConfig={{
          pagingDotsClassName: "hidden",
        }}
      >
        {onStageBidItem?.imageStorageIds?.map((id) => {
          const getImageUrl = new URL(
            `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
          );
          getImageUrl.searchParams.set("storageId", id);

          return (
            <img
              src={getImageUrl.href}
              alt=""
              key={id}
              className="w-full object-cover h-[30vh] my-auto rounded-md"
            />
          );
        })}
      </Carousel> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url.href}
        alt=""
        className="w-full object-cover h-[30vh] my-auto rounded-md"
      />
    </div>
  );
};
