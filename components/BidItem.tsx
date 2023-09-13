import { BidItem as BidItemType } from "@/types/globals";
import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { ItemHistory } from "./ItemHistory";

export const BidItem = ({
  item,
  addItemToStage,
}: {
  item: BidItemType;
  addItemToStage: (item: BidItemType) => void;
}) => {
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
    <div className="bg-gray-100 aspect-square p-3 rounded text-sm cursor-pointer relative">
      <div onClick={() => addItemToStage(item)}>
        {imageUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt=""
            className="w-full aspect-square mb-5 object-cover rounded"
          />
        )}
        <p>{item.price}</p>
        <p>{item.title}</p>
        <p className="line-clamp-2">{item.description}</p>
      </div>
      {/* Cant click this icon. Each time i click it clicks the parent div */}
      {item.isSold && (
        <FontAwesomeIcon
          icon={faEllipsisVertical}
          className="absolute right-3 bottom-3 z-50"
          onClick={() => setIsShowingItemHistory(true)}
        />
      )}
      {isShowingItemHistory && (
        <ItemHistory item={item} close={() => setIsShowingItemHistory(false)} />
      )}
    </div>
  );
};
