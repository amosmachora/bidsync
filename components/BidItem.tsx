import { useGlobalData } from "@/hooks/useGlobalData";
import { BidItem as BidItemType } from "@/types/globals";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ItemHistory } from "./ItemHistory";
import UserProfileData from "./UserProfileData";

export const BidItem = ({ item }: { item: BidItemType }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isShowingItemHistory, setIsShowingItemHistory] = useState(false);

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

  return (
    <div className="bg-white pb-5 p-3 rounded text-sm cursor-pointer relative w-1/2">
      <div>
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
          {item.price}
        </p>
      </div>
      {/* Cant click this icon. Each time i click it clicks the parent div */}
      {/* {item.isSold && (
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className="absolute right-3 bottom-3 z-50"
          onClick={() => setIsShowingItemHistory(true)}
        />
      )} */}
      {isShowingItemHistory && (
        <ItemHistory item={item} close={() => setIsShowingItemHistory(false)} />
      )}
    </div>
  );
};
