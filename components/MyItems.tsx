import { api } from "@/convex/_generated/api";
import useStoreUserEffect from "@/hooks/useStoreUserEffect";
import { BidItem as BidItemType } from "@/types/globals";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import { useState } from "react";
import { BidItem } from "./BidItem";
import { NewItemCreator } from "./CreateNewItem";
import { ScrollArea } from "./ui/scroll-area";
import { UserConsentModal } from "./UserConsentModal";

export const MyItems = () => {
  const [showItemCreatorModal, setShowItemCreatorModal] = useState(false);
  const [itemToBeAddedToStage, setItemToBeAddedToStage] =
    useState<BidItemType | null>(null);

  const [isShowingUserConsentModal, setIsShowingUserConsentModal] =
    useState(false);

  const userId = useStoreUserEffect();

  const biditems = useQuery(api.biditems.getBidItemsByUserId, {
    userId: userId ?? undefined,
  });

  const addItemToStage = (bidItem: BidItemType) => {
    setItemToBeAddedToStage(bidItem);
    setIsShowingUserConsentModal(true);
  };

  return (
    <div className="w-1/4 p-[2%] flex flex-col">
      <p className="mb-3">My Bid Items</p>
      <ScrollArea className="flex-grow h-[1px]">
        <div className="grid grid-cols-2 gap-4">
          <div
            className="aspect-square border rounded relative border-blue-600 cursor-pointer hover:scale-105 transition-all duration-200"
            onClick={() => setShowItemCreatorModal(true)}
          >
            <FontAwesomeIcon
              icon={faPlus}
              className="h-5 w-5 text-blue-600 center-absolutely"
            />
          </div>
          {biditems?.map((item) => (
            <BidItem
              item={item}
              key={item._id}
              addItemToStage={addItemToStage}
            />
          ))}
        </div>
      </ScrollArea>
      {showItemCreatorModal && (
        <NewItemCreator close={() => setShowItemCreatorModal(false)} />
      )}
      {isShowingUserConsentModal && (
        <UserConsentModal
          close={() => setIsShowingUserConsentModal(false)}
          bidItem={itemToBeAddedToStage!}
        />
      )}
    </div>
  );
};
