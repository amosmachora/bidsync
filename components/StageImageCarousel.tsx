import React from "react";
import Carousel from "nuka-carousel";
import { BidItem } from "@/types/globals";

export const StageImageCarousel = ({
  onStageBidItem,
}: {
  onStageBidItem?: BidItem | null;
}) => {
  return (
    <div className="w-1/2 overflow-hidden flex flex-col h-full show">
      <Carousel
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
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getImageUrl.href}
              alt=""
              key={id}
              className="w-full object-cover h-[30vh] my-auto rounded-md"
            />
          );
        })}
      </Carousel>
      <div className="p-5">
        <p>{onStageBidItem?.title}</p>
        <p className="uppercase">{onStageBidItem?.price}</p>
        <p>{onStageBidItem?.description}</p>
      </div>
    </div>
  );
};
