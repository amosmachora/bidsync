import { BidItem as BidItemType } from "@/types/globals";
import { useEffect, useState } from "react";

export const BidItem = ({
  item,
  addItemToStage,
}: {
  item: BidItemType;
  addItemToStage: (item: BidItemType) => void;
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
    <div
      className="bg-gray-100 aspect-square p-3 rounded text-sm cursor-pointer"
      onClick={() => addItemToStage(item)}
    >
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
  );
};
