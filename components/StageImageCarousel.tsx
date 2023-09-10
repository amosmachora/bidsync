import React from "react";
import Carousel from "nuka-carousel";

export const StageImageCarousel = ({
  imageStorageIds,
}: {
  imageStorageIds?: string[];
}) => {
  return (
    <div className="w-1/2 overflow-hidden flex flex-col h-full">
      <Carousel
        enableKeyboardControls
        wrapAround
        defaultControlsConfig={{
          pagingDotsClassName: "hidden",
        }}
      >
        {imageStorageIds?.map((id) => {
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
    </div>
  );
};
