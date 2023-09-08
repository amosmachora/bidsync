import { api } from "@/convex/_generated/api";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "convex/react";
import { useState } from "react";
import { BidItem } from "./BidItem";
import { NewItemCreator } from "./CreateNewItem";

export const MyItems = () => {
  const [showItemCreatorModal, setShowItemCreatorModal] = useState(false);

  const biditems = useQuery(api.biditems.getAllBidItems);
  return (
    <div className="w-1/4 flex-grow p-4 overflow-y-auto">
      <p className="mb-3">My Bid Items</p>
      <div className="grid grid-cols-2 gap-4">
        {biditems?.map((item) => (
          <BidItem item={item} key={item._id} />
        ))}
        <div
          className="aspect-square border rounded relative border-blue-600 cursor-pointer hover:scale-105 transition-all duration-200"
          onClick={() => setShowItemCreatorModal(true)}
        >
          <FontAwesomeIcon
            icon={faPlus}
            className="h-5 w-5 text-blue-600 center-absolutely"
          />
        </div>
      </div>
      {showItemCreatorModal && (
        <NewItemCreator close={() => setShowItemCreatorModal(false)} />
      )}
    </div>
  );
};
