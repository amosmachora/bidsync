import React, { useState } from "react";
import Carousel, { ControlProps } from "nuka-carousel";
import { BidItem } from "@/types/globals";
import { Overlay } from "./Overlay";
import { CustomBottomLeftControls } from "./CustomBottomLeftControls";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const StageImageCarousel = ({
  onStageBidItem,
}: {
  onStageBidItem?: BidItem | null;
}) => {
  const url = new URL(`${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`);
  url.searchParams.set("storageId", onStageBidItem?.imageStorageIds?.at(0)!);

  const [isShowingCarousel, setIsShowingCarousel] = useState(false);

  return (
    <div className="w-1/2 overflow-hidden">
      {isShowingCarousel && (
        <Overlay blackBackdrop>
          <div className="fixed top-1/2 z-50 -translate-y-1/2 w-[30vw]">
            <FontAwesomeIcon
              icon={faXmark}
              className="h-5 w-5 cursor-pointer absolute -top-10 -right-10 text-[#E03636]"
              onClick={() => setIsShowingCarousel(false)}
            />
            <Carousel
              enableKeyboardControls
              wrapAround
              defaultControlsConfig={{
                pagingDotsClassName: "hidden",
                nextButtonStyle: {
                  display: "none",
                },
                prevButtonStyle: {
                  display: "none",
                },
              }}
              renderBottomLeftControls={(props: ControlProps) => (
                <CustomBottomLeftControls {...props} />
              )}
            >
              {onStageBidItem?.imageStorageIds?.map((id) => {
                const getImageUrl = new URL(
                  `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
                );
                getImageUrl.searchParams.set("storageId", id);

                return (
                  //  eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl.href}
                    alt=""
                    key={id}
                    className="w-full object-cover h-[40vh] my-auto rounded-md"
                  />
                );
              })}
            </Carousel>
            <div className="flex gap-x-4 items-center">
              {onStageBidItem?.imageStorageIds?.map((id) => {
                const getImageUrl = new URL(
                  `${process.env.NEXT_PUBLIC_CONVEX_SITE_URL}/getImage`
                );
                getImageUrl.searchParams.set("storageId", id);

                return (
                  //  eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getImageUrl.href}
                    alt=""
                    key={id}
                    className="w-20 aspect-square rounded mt-5 object-cover mx-auto cursor-pointer"
                  />
                );
              })}
            </div>
          </div>
        </Overlay>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url.href}
        alt=""
        className="w-full object-cover h-[30vh] my-auto rounded-md cursor-pointer"
        onClick={() => setIsShowingCarousel(true)}
      />
    </div>
  );
};
